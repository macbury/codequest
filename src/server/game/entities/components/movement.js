import Base from './base'
import { PlayerStatus, Direction, Trigger } from 'shared/consts'
import { negateDirection, directionVector } from 'shared/map_utils'

const logger = require('../../logger').get('Movement')

/**
* Finds path, and calculates movement
*/
export default class Movement extends Base {
  init() {
    this.localEvents.on('leavedMap', this.clearMovement, this)
    this.localEvents.on('client:goTo', this.handleGoTo, this)
    this.state.set('speed', 150)//TODO set default?
    this.route = null
  }

  /**
  * Clear movement information
  */
  clearMovement() {
    logger.debug('Clearing path...')
    this.state.remove('target', true)
    this.route = null
  }

  canMove() {
    return (this.currentMap != null) && this.state.isEqual('status', PlayerStatus.Exploring.value)
  }

  handleGoTo(location) {
    if (this.canMove()) {
      this.moveTo(location)
    } else {
      logger.error(`Movement request ignored, Player current status is: ${this.entity.status.key}`)
    }
  }

  /**
  * Adjust target of final approach. If target is at entity with ClickTrigger, try to find target
  * that is in front of this entity
  * @param {Location} location which would be delightful to arrive
  */
  adjustTarget(location) {
    let clickableEntity = this.eventMap.get(location).find((entity) => {
      return entity.state.getEnum('trigger', Trigger) == Trigger.Click
    })

    let touchableEntity = this.eventMap.get(location).find((entity) => {
      return entity.state.getEnum('trigger', Trigger) == Trigger.Touch
    })

    if (clickableEntity != null) {
      logger.debug(`Found clickable entity`)
      let direction = clickableEntity.state.getEnum('direction', Direction, Direction.Down)
      let tileVec = directionVector(direction)
      let targetDirection = negateDirection(direction)
      let target = {
        col: location.col + tileVec.col,
        row: location.row + tileVec.row
      }
      return {...target, direction: targetDirection.value, trigger: clickableEntity.id}
    } else if (touchableEntity != null) {
      logger.debug(`Found touchable entity`)
      return {...location, trigger: touchableEntity.id}
    } else {
      return location
    }
  }

  isOnlyTrigger({ col, row, trigger }) {
    return col == null && row == null && trigger != null
  }

  /**
  * Calculate path to destination, and mark this as dirty, to be broadcasted in next delta package
  * @param {object} location object with col, row and optional map
  */
  moveTo({ col, row }) {
    logger.info(`Player ${this.userId} is ${JSON.stringify({ col, row })}`)
    let start = {...this.state.get('location')}
    let end = this.adjustTarget({ col, row })

    let currentTarget = this.state.get('target', {})
    if (currentTarget.col == end.col && currentTarget.row == end.row) {
      logger.debug('Ignoring path finding(target is still the same)')
      return false
    }

    // calculate route, set it to player to be broadcasted in next update
    logger.debug(`Finding path from ${start.col}x${start.row} to ${end.col}x${end.row}`)
    let path = this.currentMap.findPath({ start, end })
    if (path == null || path.length == 0) {
      logger.debug('Path not found!')
      this.route = null
      this.state.remove('target', true)
    } else {
      let target = path[path.length-1]
      this.route = {
        departureTime: Date.now(),
        path
      }

      this.state.set('target', end)
    }
  }

  update() {
    if (this.route == null) {
      this.state.remove('target', true)
      return
    }

    let { path, departureTime } = this.route
    let previousLocation = this.state.get('location')

    let speed = this.state.get('speed')

    let delta = Math.ceil(Math.abs(Date.now() - departureTime)/speed)
    let maxDelta = path.length - 1

    if(delta > maxDelta) delta = maxDelta

    let targetLocation= path[delta]

    if (previousLocation.col != targetLocation.col || previousLocation.row != targetLocation.row) {
      this.state.set(
        'location',
        {...previousLocation, ...targetLocation},
        true
      )

      this.localEvents.emit('moved', { from: previousLocation, to: targetLocation })
    }

    if (maxDelta == delta) {
      logger.debug(`Player ${this.userId} reached destination`)
      this.route = null
    }
  }

  dispose() {
    this.state.remove('target')
    this.localEvents.removeListener('client:goTo', this.handleGoTo, this)
    super.dispose()
  }
}
