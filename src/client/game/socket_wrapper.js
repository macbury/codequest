import io from 'socket.io-client'
import Protocol from '../../shared/protocol'

/**
* Wraps socket io stuff, and allows to use Phaser events to pipe them to server
* All events are prefixed by server so event from server teleport will trigger event 'server:teleport'
*/
export default class SocketWrapper {

  setup(socket) {
    this.socket = socket
    this.socket.on('connect', this.onConnect.bind(this))
    this.socket.on('disconnect', this.onDisconnect.bind(this))

    this.waitEventsFrom(Protocol.boot)
    this.waitEventsFrom(Protocol.reload)
    this.waitEventsFrom(Protocol.startSetup)
    this.waitEventsFrom(Protocol.setupError)
    this.waitEventsFrom(Protocol.ping)
    this.waitEventsFrom(Protocol.update)
    this.waitEventsFrom(Protocol.errors)
  }

  setupOnce() {
    if (this.socket != null) {
      return
    }
    this.setup(io(`${window.location.protocol}//${window.location.host}`))
  }

  pipe(eventEmitter) {
    this.events = eventEmitter
    this.emitsEventsFor(Protocol.changeName)
    this.emitsEventsFor(Protocol.goTo)
    this.emitsEventsFor(Protocol.triggerEvent)
    this.emitsEventsFor(Protocol.nextAct)
    this.emitsEventsFor(Protocol.ponq)
    this.events.on('server:ping', this.onPing, this)
    this.events.on('client:ready', () => this.socket.emit('ready') )
  }

  disconnect() {
    this.socket.disconnect(true)
    this.socket = null
  }

  onConnect() {
    this.events.emit('server:connected')
  }

  onPing(stamp) {
    //console.log('got ping', stamp)
    this.events.emit('client:ponq', stamp)
    //this.socket.emit('ponq', stamp)
  }

  onDisconnect() {
    this.events.emit('server:disconnect')
  }

  emitsEventsFor(protocol) {
    let eventName = `client:${protocol.channel}`
    this.events.on(eventName, (data) => {
      //console.log(`Triggering ${eventName} with`, data)
      protocol.emit(this.socket, data)
    })
  }

  waitEventsFrom(protocol) {
    protocol.listen(this.socket, (data) => {
      if (data && data.stamp) {
        this.onPing(data.stamp)
      }

      this.events.emit(`server:${protocol.channel}`, data)
    })
  }
}
