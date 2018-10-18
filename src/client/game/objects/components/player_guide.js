import Base from './base'
import { tileDistance } from '../../../../shared/map_utils'
import { Trigger } from '../../../../shared/consts'
/**
* Send information about clicked stuff on map
* - only move if player is not acting
*/
export default class PlayerGuide extends Base {
  init() {
    this.enabled = true
    this.on('map:passableTileClicked', this.handleMapClick)
    this.localEvents.on('acting:begin', this.disableMapClick, this)
    this.localEvents.on('acting:finish', this.enableMapClick, this)
  }

  handleMapClick({ tile }) {
    if (!this.enabled) {
      return
    }
    let { col, row } = tile
    let clickedEntity = this.entityMap.getFirst(tile)
    if (clickedEntity != null) {
      let distanceToEntity = tileDistance(clickedEntity, this.entity)

      let { trigger } = clickedEntity.state
      if (trigger == null) {
        this.events.emit('client:goTo', { col, row })
        return
      }

      if (
        (trigger == Trigger.Click && distanceToEntity == 1) ||
        (trigger == Trigger.Touch && distanceToEntity == 0)
      ) {
        this.events.emit('client:triggerEvent', { id: clickedEntity.id })
        return
      }
    }
    this.events.emit('client:goTo', { col, row })
  }

  disableMapClick() {
    this.enabled = false
  }

  enableMapClick() {
    this.enabled = true
  }

  dispose() {
    this.localEvents.removeListener('acting:begin', this.disableMapClick, this)
    this.localEvents.removeListener('acting:finish', this.enableMapClick, this)
    this.off('map:passableTileClicked', this.handleMapClick)
  }
}
