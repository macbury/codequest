import Base from './base'
import { Trigger } from '../../../../shared/consts'
/**
* Handle all event base update stuff
*/
export default class Event extends Base {
  handleServerUpdate({ trigger }) {
    if (trigger != null) {
      this.state.trigger = Trigger.get(trigger)
    }
  }
}
