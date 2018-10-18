import Base from './base'

const logger = require('../../logger').get('Cartographer')

/**
* Check if player did move, and update its location in EntityMap
*/
export default class Cartographer extends Base {
  init() {
    logger.debug(`Initialized for: ${this.entity.id}`)
    this.localEvents.on('moved', this.handleMovement, this)
    this.localEvents.on('enteredMap', this.addToSpace, this)
    this.localEvents.on('leavedMap', this.removeFromSpace, this)
    this.localEvents.on('pageChanged', this.handleEventPage, this)

    if (this.state.isPresent('location') && this.eventMap != null) {
      this.addToSpace()
    }
  }

  handleMovement({ from, to }) {
    logger.debug(`Moving from: ${JSON.stringify(from)} to ${JSON.stringify(to)}`)
    this.eventMap.delete(from, this.entity)
    this.eventMap.add(to, this.entity)
  }

  handleEventPage() {
    let blocking = this.state.get('blocking')
    this.removeFromSpace()
    this.addToSpace()
  }

  addToSpace() {
    let location = this.state.get('location')
    logger.debug(`Space occupied at: ${JSON.stringify(location)} by ${this.entity.id}`)
    this.eventMap.add(location, this.entity)
  }

  removeFromSpace() {
    if (this.eventMap == null) {
      return
    }
    let location = this.state.get('location')
    logger.debug(`Removing : ${JSON.stringify(location)}`)
    this.eventMap.delete(location, this.entity)
  }

  dispose() {
    this.localEvents.removeListener('moved', this.handleMovement, this)
    this.localEvents.removeListener('enteredMap', this.addToSpace, this)
    this.localEvents.removeListener('leavedMap', this.removeFromSpace, this)
    this.localEvents.removeListener('pageChanged', this.handleEventPage, this)
    this.removeFromSpace()
    super.dispose()
  }
}
