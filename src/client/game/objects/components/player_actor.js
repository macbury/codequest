import Base from './base'
import actions from '../actions'
/**
* Handles actions sended by server like, show message box and etc
*/
export default class PlayerActor extends Base {
  init() {
    this.on('handleDirectorActions', this.handleDirectorActions)
  }

  handleDirectorActions(actions) {
    if (actions == null) {
      console.log('Finished acting...')
      this.localEvents.emit('acting:finish')
    } else {
      console.log('Begining acting...')
      this.localEvents.emit('acting:begin')
      this.actions = actions.slice()
      this.nextAction()
    }
  }

  /**
  * Run next action
  * @return {bool} false if all actions performed
  */
  nextAction() {
    if (this.actions.length == 0) {
      return false
    }

    let { type, payload } = this.actions.shift()
    if (actions[type] == null) {
      console.error(`Undefined action!`, type)
      this.actions = null
      return false
    }
    if (payload != null) {
      payload = JSON.parse(payload)
    }

    let actionFunc = actions[type]
    actionFunc(payload, this.entity).then(this.nextAction.bind(this))

    return true
  }
}
