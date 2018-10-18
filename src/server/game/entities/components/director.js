import Base from './base'

const logger = require('../../logger').get('Director')
import { PlayerStatus } from 'shared/consts'
/**
* Handles Screenplay from Event and executes it. When somebody will trigger `act` event on it with Screenplay
* This is attached to player
*/
export default class Director extends Base {
  init() {
    this.localEvents.on('act', this.handleAct, this)
    this.localEvents.on('leavedMap', this.clearAct, this)
  }

  /**
  * Screenplay ready to execute
  * @param {Screenplay} screenplay to be runned
  */
  async handleAct(screenplay) {
    if (this.entity.status != PlayerStatus.Exploring) {
      logger.debug(`${this.entity.id} status is ${this.entity.status.key}, that prevents acting!`)
      return
    }
    logger.debug(`${this.entity.id} is going to start acting`)
    this.state.setEnum('status', PlayerStatus.Interacting)
    logger.debug(`Changed status to ${this.entity.status.key}`)
    this.screenplay = screenplay
    await this.screenplay.run(this.entity)
    this.clearAct()
  }

  /**
  * Clear running event. It should not run across maps...
  */
  clearAct() {
    logger.debug('Clearing act...')
    this.entity.actions = null
    if (this.entity.status != PlayerStatus.Setup) {
      this.state.setEnum('status', PlayerStatus.Exploring)
    }
    logger.debug(`Changed status to ${this.entity.status.key}`)
    if (this.screenPlay != null) {
      this.screenPlay.dispose()
    }
    this.screenPlay = null
    this.currentRun = null
  }

  dispose() {
    this.localEvents.removeListener('act', this.handleAct, this)
    this.localEvents.removeListener('leavedMap', this.clearAct, this)
    this.clearAct()
    super.dispose()
  }
}
