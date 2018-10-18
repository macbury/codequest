import quickselect from 'quickselect'
import Base from './base'
import { PING_INTERVAL } from 'shared/consts'
const logger = require('../../logger').get('Latency')
/**
* Compute the median of an array using the quickselect algorithm
*/
function quickMedian (arr) {
  let l = arr.length
  let n = (l%2 == 0 ? (l/2)-1 : (l-1)/2)
  quickselect(arr,n)
  return arr[n]
}

/**
* Calculate latency
* Set quietly latency in state
*/
export default class Latency extends Base {
  init() {
    this.pings = []
    this.localEvents.on('client:ponq', this.handlePong, this)
    this.state.set('latency', 0, true)
    this.pingTimer = setInterval(this.sendPing.bind(this), PING_INTERVAL)
    this.resetTimeout()
  }

  sendPing() {
    this.localEvents.emit('remote:ping', this.server.getShortStamp())
  }

  resetTimeout() {
    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = null
    }

    this.timeoutTimer = setTimeout(this.onTimeout.bind(this), PING_INTERVAL * 2)
  }

  onTimeout() {
    logger.error(`Player ${this.id} timeout!`)
    this.socket.disconnect(true)
  }

  /**
  * Handle pong response to calculate latency for player
  */
  handlePong(timestamp) {
    let ss = this.server.getShortStamp()
    let delta = (ss - timestamp)/2
    if (delta < 0) {
      delta = 0
    }
    this.pings.push(delta)
    if (this.pings.length > 20) {
      this.pings.shift()
    }
    this.latency = Math.round(quickMedian(this.pings.slice(0))) || 0
    this.state.set('latency', this.latency, true)
    this.resetTimeout()
  }

  dispose() {
    this.state.remove('latency')
    clearTimeout(this.pingTimer)
    clearTimeout(this.timeoutTimer)
    this.localEvents.removeListener('client:ponq', this.handlePong, this)
    super.dispose()
  }
}
