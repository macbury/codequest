import io from 'socket.io'
import { UPDATE_RATE, STATE_BROADCAST_RAGE } from './consts'

import EventEmitter from 'eventemitter3'
import ItemsManager from './items/manager'
import StatePersistance from './state_persistance'
import Switches from './utils/switches'
import MapsManager from './maps/manager'
import Player from './entities/player'

const logger = require('./logger').get('server')

/**
* Handles connections
*/
export default class GameServer {
  constructor(app) {
    this.events = new EventEmitter()
    this.switches = new Switches()
    this.items = new ItemsManager()
    this.session = app.get('session')
    this.app = app
    this.server = io(app.get('httpServer'), {
      pingTimeout: 60000,
      pingInterval: 30000
    })
    this.maps = new MapsManager(this)
    this.players = {}
    this.statePersistance = new StatePersistance(this.repositories, this.switch, this.players)
    this.setupMiddelwares()

    setInterval(this.updateGame.bind(this), UPDATE_RATE)
    setInterval(() => { this.maps.broadcastPackets() }, STATE_BROADCAST_RAGE)
  }

  get repositories() {
    return this.app.get('repositories')
  }

  /**
  * Update delta time and inform all maps and its entites about that fact
  */
  updateGame() {
    this.switches.update()
    this.maps.updateWorld()
  }

  setupMiddelwares() {
    this.server.use(({ handshake }, next) => { this.session(handshake, {}, next) })
    this.server.use(this.authMiddleware.bind(this))
  }

  isUserLoggedIn(userId) {
    return this.players[userId] != null
  }

  sendError(socket, message) {
    logger.error(message)
    socket.emit('errors', { message })
    setTimeout(function() {
      socket.disconnect(true)
    }, 5000)
  }

  authMiddleware(socket, next) {
    let userId = socket.handshake.session.passport.user

    if (userId == null) {
      this.sendError(socket, 'Login is required')
    } else if (this.isUserLoggedIn(userId)) {
      this.sendError(socket, 'Already connected')
    } else {
      let { players } = this.app.get('repositories')
      players.find(userId).then((playerData) => {
        if (playerData == null) {
          this.sendError(socket, 'User not found')
        } else {
          let { state, _id } = playerData

          this.players[_id] = new Player({
            ...state,
            id: _id
          }, this, socket)
          logger.info(`New socket connection from ${_id}. There current player number is ${this.size}`)
          next()
        }
      })
    }
  }

  getShortStamp() {
    return parseInt(Date.now().toString().substr(-9))
  }

  get size() {
    return Object.keys(this.players).length
  }
}
