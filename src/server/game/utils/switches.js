import EventEmitter from 'eventemitter3'
import _ from 'underscore'
/**
* Manage global switch state used by events
*/
export default class Switches {
  constructor() {
    this.data = {}
    this.toExpire = []
    this.events = new EventEmitter()
    this.dirty = true
  }

  /**
  * @return {boolean} returns true if is ON
  */
  isOn(key) {
    return this.get(key) == true
  }

  /**
  * Switch state of key to off after some time
  * @param {string} key name of the key
  * @param {integer} seconds number of seconds from now
  */
  expireIn(key, seconds) {
    if (this.isOn(key)) {
      let expireAt =  Date.now() + (seconds * 1000)
      this.toExpire.push({ expireAt, key })
      this.dirty = true
    }
  }

  /**
  * @return {boolean} returns true if is OFF
  */
  isOff(key) {
    return !this.get(key)
  }

  exists(key) {
    return this.data[key] == null
  }

  /**
  * Set state of the key. If state did change it emits event with name: `changed:key-name`
  */
  set(key, state) {
    if (this.data[key] != state) {
      this.data[key] = state
      this.events.emit(`changed:${key}`, key, state)
    }
  }

  get(key) {
    return this.data[key] || false
  }

  /**
  * Check if keys did expire, and trigger events with this
  */
  update() {
    if (this.dirty) {
      this.dirty = false
      this.toExpire = _.sortBy(this.toExpire, ({expireAt}) => { return expireAt } )
    }

    let currentTime = Date.now()
    while (this.toExpire.length > 0) {
      let { expireAt, key } = this.toExpire[0]
      if (currentTime < expireAt) {
        break
      }
      this.toExpire.shift()
      this.set(key, false)
    }
  }

  save() {

  }
}
