//import Protobuf from 'protobufjs'
import { WorldDeltaState, Location, TriggerEvent, Error } from './finalProtocol'

class Protocol {
  constructor(channel, schema) {
    this.channel = channel
    this.schema = schema
  }

  /**
  * Send encoded data to socket
  */
  emit(socket, data) {
    if (this.schema == null) {
      socket.emit(this.channel, JSON.stringify(data))
    } else {
      let err = this.schema.verify(data)
      if (err) {
        console.error(`Object could not be encoded for: ${this.channel}`)
        console.error(JSON.stringify(data))
        throw Error(err)
      } else {
        let buffer = this.schema.encode(data).finish()
        socket.emit(this.channel, new Buffer(buffer))
      }
    }
  }

  /**
  * Listen on specified channel and decode data to js objects
  */
  listen(socket, callback) {
    if (this.schema == null) {
      let triggerFun = (buffer) => {
        if (buffer == null) {
          callback()
        } else {
          try {
            let data = JSON.parse(buffer.toString('utf8'))
            callback(data)
          } catch (e) {
            console.error(`Error while decoding: ${this.channel}: `, e)
            console.log(buffer.toString('utf8'))
          }
        }
      }
      socket.on(this.channel, triggerFun)
      return triggerFun
    } else {
      let triggerFun = (payload) => {
        try {
          let buffer = new Buffer(payload)
          let schemaObj = this.schema.decode(buffer)
          let data = this.schema.toObject(schemaObj)
          callback(data)
        } catch (e) {
          console.error(`Error from data in channel: ${this.channel}`)
          console.error(e)
        }
      }
      socket.on(this.channel, triggerFun)
      return triggerFun
    }
  }

  off(socket, triggerFun) {
    socket.removeListener(this.channel, triggerFun)
  }
}

const Protocols = {
  startSetup: new Protocol('startSetup'),
  setupError: new Protocol('setupError', Error),
  changeName: new Protocol('changeName'),
  ready: new Protocol('ready'),
  errors: new Protocol('errors'),
  boot: new Protocol('boot'),
  reload: new Protocol('reload'),
  goTo: new Protocol('goTo', Location),
  update: new Protocol('update', WorldDeltaState),
  ponq: new Protocol('ponq'),
  ping: new Protocol('ping'),
  nextAct: new Protocol('nextAct'),
  triggerEvent: new Protocol('triggerEvent', TriggerEvent)
}

export default Protocols
