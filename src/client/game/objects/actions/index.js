import teleport from './teleport'
import message from './message'
import act from './act'
import wait from './wait'
import nop from './nop'
const actions = {
  'teleport': teleport,
  'message': message,
  'act': act,
  'wait': wait,
  'nop': nop
}

export default actions
