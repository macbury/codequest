import Base from './base'
import Screenplay from 'server/game/entities/screenplay/screenplay'
import { Trigger } from 'shared/consts'
import { extractSwitchNames, checkPagesConditions } from 'server/game/utils/event/conditions'

const logger = require('../../logger').get('Event')

/**
* Handle events on map. On change in switches sets new screenplay and appropiate state
*/
export default class Event extends Base {
  /**
  * Initialize event recipe
  * @param {Array<Object>} pages deserialized pages
  */
  init(pages) {
    this.currentPageIndex = 0
    this.pages = pages

    if (this.pages == null) {
      logger.error(`Could not recipe for event: ${this.entity.id}`)
    } else {
      this.subscribeSwitches()
      this.findCurrentPage()
      this.updateScreenplayState()

      this.localEvents.on('trigger', this.handleTrigger, this)
    }
  }

  /**
  * Find all switches in conditions, and subscribe for changes
  */
  subscribeSwitches() {
    this.switchNames = extractSwitchNames(this.pages)
    logger.debug(`Switches for ${this.entity.id} are: ${JSON.stringify(this.switchNames)}`)
    this.switchNames.forEach((name) => {
      this.switches.events.on(`changed:${name}`, this.findCurrentPage, this)
    })
  }

  /**
  * Go through screenplay pages from last to first and find first one that conditions are empty or are meet
  */
  findCurrentPage() {
    let prevPageIndex = this.currentPageIndex
    let context = { switches: this.switches }
    this.currentPageIndex = checkPagesConditions({ pages: this.pages, context })

    if (prevPageIndex != this.currentPageIndex) {
      logger.debug(`Event ${this.entity.id} page is: ${this.currentPageIndex}`)
      this.updateScreenplayState()
    }
  }

  /**
  * Update state of entity to match state required by screenplay
  */
  updateScreenplayState() {
    let { state } = this.currentPage
    if (state == null) {
      state = {}
    }
    let id = this.state.get('id')
    let location = this.state.get('location')
    let targetState = {...state, location, id}
    this.state.updateAll(targetState)
    this.localEvents.emit('pageChanged')
    //logger.debug(`Setting target state to: ${JSON.stringify(targetState)}`)
  }

  /**
  * Handle trigger only if location and map of player is the same as this entity
  * @param{Player|Entity} entity that triggered this entity
  */
  handleTrigger(playerEntity) {
    let distance = this.entity.distanceToEntity(playerEntity)
    if (this.trigger == Trigger.Touch && distance == 0 || this.trigger == Trigger.Click && distance == 1) {
      let { action } = this.currentPage
      let screenplay = new Screenplay(this.entity, action)
      playerEntity.localEvents.emit('act', screenplay)
    } else {
      logger.error(`Event ${playerEntity.id} is too far from ${this.entity.id} by ${distance} tiles`)
    }
  }

  /**
  * Get current page of screenplay
  */
  get currentPage() {
    return this.pages[this.currentPageIndex]
  }

  /**
  * Current trigger type assigned to event
  * @return {Trigger}
  */
  get trigger() {
    return Trigger.get(this.state.get('trigger', 'none'))
  }

  dispose() {
    this.localEvents.removeListener('trigger', this.handleTrigger, this)
    this.switchNames.forEach((name) => {
      this.switches.events.removeListener(`changed:${name}`, this.findCurrentPage, this)
    })
    super.dispose()
  }
}
