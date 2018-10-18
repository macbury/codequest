import Base from './base'

/**
* Send trigger events by player on click/movement end etc.
*/
export default class PlayerTrigger extends Base {
  init() {
    this.localEvents.on('movement:finished', this.handleMovementFinished, this)
  }

  handleServerUpdate({ target }) {
    if (target == null) {
      delete this.state['trigger']
    } else {
      console.log('handleServerUpdate:', target)
      this.state.trigger = target.trigger

      if (target.col == null && target.row == null) {
        this.handleMovementFinished()
      }
    }
  }

  handleMovementFinished() {
    if (this.state.trigger != null) {
      let eventIdToTrigger = this.state.trigger
      this.events.emit('client:triggerEvent', { id: eventIdToTrigger })
    }

    delete this.state['trigger']
  }
}
