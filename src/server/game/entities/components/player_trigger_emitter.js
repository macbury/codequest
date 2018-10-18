import Base from './base'

const logger = require('../../logger').get('PlayerTriggerEmitter')

/**
* Listen for trigger event on socket with entity id.
* If there is any find this entity on current map and emit `trigger` event to it with current player
*/
export default class PlayerTriggerEmitter extends Base {
  init() {
    this.localEvents.on('client:triggerEvent', this.onTriggerEvent, this)
  }

  /**
  * Find entity on map and emit to it `trigger` event
  * @param {string} entityId uuid of entity
  */
  onTriggerEvent({ id }) {
    let targetEntity = this.currentMap.getEntity(id)

    if (targetEntity == null) {
      logger.error(`Entity ${id} dont exist`)
      return
    }

    logger.debug(`Sending trigger to ${id} with ${this.entity.id}`)
    targetEntity.localEvents.emit('trigger', this.entity)
  }

  dispose() {
    this.localEvents.removeListener('client:triggerEvent', this.onTriggerEvent, this)
    super.dispose()
  }
}
