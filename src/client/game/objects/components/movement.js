import Base from './base'
import { tileToCharsetWorldPosition } from '../../../../shared/map_utils'

const TEMP_POSITION = { col: -1, row: -1 }

/**
* Set entity position, or it if there is a path move alongside of it
*/
export default class Movement extends Base {
  init() {
    this.state.movement = false
    this.entity.setTile(TEMP_POSITION)
    this.locationAdjustEnabled = true
    this.localEvents.on('markCurrentPlayer', this.disableJumps, this)
  }

  disableJumps() {
    this.jumpsAreDissabled = true
  }

  handleServerUpdate(entityData) {
    let { location, target, entered, speed, latency } = entityData

    // There is current location and distance to it is larger than one tile, snap it!
    if (location != null && (entered || (this.entity.col == TEMP_POSITION.col && this.entity.row == TEMP_POSITION.row))) {
      this.entity.setTile(location)
    }

    if (target != null) {
      let path = this.mapData.findPath({ start: this.entity, end: target })
      this.move(path, latency, speed, target.direction)
    } else if (!this.jumpsAreDissabled && (this.entity.col != location.col || this.entity.row != location.row)) {
      this.entity.setTile(location)
    }
  }

  move(path, latency, speed, targetDirection) {
    this.clearTween()
    this.state.movement = true
    this.targetDirection = targetDirection
    let delta = (latency + this.world.latency)

    let duration = Math.ceil(Math.max(1, path.length * speed - delta))

    let tweens = []
    for (let i = 1; i < path.length; i++) {
      let origin = path[i-1]
      let target = path[i]
      let { x, y } = tileToCharsetWorldPosition(path[i])
      let tween = {
        x, y,
        onStart: () => {
          this.localEvents.emit('movement:waypoint', { target, origin })
        },
      }
      tweens.push(tween)
    }

    this.timeline = this.scene.tweens.timeline({
      targets: this.entity,
      totalDuration: duration,
      tweens,
      onStart: () => { this.localEvents.emit('movement:begin') },
      onComplete: this.finishMovement.bind(this)
    })
  }

  finishMovement() {
    if (this.targetDirection != null) {
      this.state.direction = this.targetDirection
      this.targetDirection = null
    }
    this.localEvents.emit('movement:finished')
    this.clearTween()
  }

  clearTween() {
    this.direction = null
    this.state.movement = false
    if (this.timeline != null) {
      this.timeline.stop()
      this.timeline = null
    }
  }

  get mapData() {
    return this.scene.map.data
  }

  dispose() {
    this.localEvents.removeListener('markCurrentPlayer', this.disableJumps, this)
    this.clearTween()
    super.dispose()
  }
}
