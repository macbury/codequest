import Protocol from 'shared/protocol'

/**
* Redirect events from eventEmitter to socket
*/
export default class SocketRelay {
  constructor(socket, events) {
    this.socket = socket
    this.events = events
    this.socket.on('connect', this.onConnect.bind(this))
    this.socket.on('disconnect', this.onDisconnect.bind(this))

    this.waitEventsFrom(Protocol.ready)
    this.waitEventsFrom(Protocol.nextAct)
    this.waitEventsFrom(Protocol.goTo)
    this.waitEventsFrom(Protocol.triggerEvent)
    this.waitEventsFrom(Protocol.ponq)
    this.waitEventsFrom(Protocol.changeName)

    this.emitsEventsFor(Protocol.boot)
    this.emitsEventsFor(Protocol.reload)
    this.emitsEventsFor(Protocol.startSetup)
    this.emitsEventsFor(Protocol.update)
    this.emitsEventsFor(Protocol.ping)
    this.emitsEventsFor(Protocol.setupError)

    this.events.on('client:ready', () => this.socket.emit('ready') )
  }

  onConnect() {
    this.events.emit('client:connected')
  }

  onDisconnect() {
    this.events.emit('client:disconnect')
  }

  emitsEventsFor(protocol) {
    let eventName = `remote:${protocol.channel}`
    this.events.on(eventName, (data) => {
      protocol.emit(this.socket, data)
    })
  }

  waitEventsFrom(protocol) {
    protocol.listen(this.socket, (data) => {
      this.events.emit(`client:${protocol.channel}`, data)
    })
  }
}
