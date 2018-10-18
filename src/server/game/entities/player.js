import SocketRelay from '../utils/socket_relay'
import Entity from './entity'
import Movement from './components/movement'
import Latency from './components/latency'
import PlayerSetup from './components/player_setup'
import PlayerTriggerEmitter from './components/player_trigger_emitter'
import Director from './components/director'
import { PlayerStatus } from 'shared/consts'

const logger = require('server/game/logger').get('player')

export default class Player extends Entity {
  constructor(state, server, socket) {
    super(state.id, state, null)
    this.socketRelay = new SocketRelay(socket, this.localEvents)
    this.server = server
    this.socket = socket

    logger.info(`Socket userId: ${this.userId}`)
    this.localEvents.on('client:disconnect', this.handleDisconnect, this)
    this.localEvents.on('client:ready', this.handlePlayerReady, this)

    this.components.add(Latency)
    this.components.add(Movement)
    this.components.add(PlayerTriggerEmitter)
    this.components.add(Director)

    if (this.status == PlayerStatus.Setup) {
      this.components.add(PlayerSetup)
    }

    this.boot()
  }

  /**
  * Sends reload webpage event to player
  */
  reload() {
    this.localEvents.emit('remote:reload')
  }

  /**
  * @return {PlayerStatus}
  */
  get status() {
    return this.state.getEnum('status', PlayerStatus, PlayerStatus.Setup)
  }

  /**
  * @param {PlayerStatus}
  */
  set status(newStatus) {
    this.state.setEnum('status', newStatus)
  }

  /**
  * First message emited to engine telling where to place player
  */
  boot() {
    if (this.status == PlayerStatus.Setup) {
      logger.info(`Sending setup request for ${this.userId}`)
      this.localEvents.emit('remote:startSetup', this.state.get('name'))
    } else {
      this.removeFromCurrentMap()
      let location = this.state.get('location')
      logger.info(`Teleporting ${this.userId} to last location at ${JSON.stringify(location)}`)
      this.localEvents.emit('remote:boot', location)
    }
  }

  /**
  * Remove player from current map if he resides in one
  */
  removeFromCurrentMap() {
    if (this.currentMap === null) {
      return false
    }
    this.currentMap.removePlayer(this)
    this.currentMap = null
  }

  /**
  * User id that identifies him
  */
  get userId() {
    return this.state.get('id')
  }

  /**
  * After player was teleported, and map finished loading he emits ready to informa all players that he entered location
  */
  handlePlayerReady() {
    if (this.status == PlayerStatus.Setup) {
      logger.error(`Player ${this.userId} is still setuping...`)
      return
    }
    let { map } = this.state.get('location')
    this.status = PlayerStatus.Exploring
    logger.info(`${this.userId} is ready on map ${map}`)
    this.currentMap = this.server.maps.get(map, this)
    this.currentMap.addPlayer(this)
  }

  /**
  * Handle disconnect functionality like removing player from roster and map
  */
  handleDisconnect() {
    this.localEvents.removeAllListeners()
    logger.info(`Player ${this.userId} disconnected`)
    this.components.dispose()
    this.server.statePersistance.syncPlayer(this.userId)
    this.removeFromCurrentMap()
    delete this.server.players[this.userId]
    this.server = null
    this.socket = null
  }

  serializedActions() {
    if (this.actions == null) {
      return null
    }

    return this.actions.map((action) => {
      return { type: action.type, payload: JSON.stringify(action.payload) }
    })
  }

  /**
  * Send standard update packet
  * @param {Object} data additional data appended to world update packet
  */
  sendUpdate(data = {}) {
    let packet = {
      stamp: this.server.getShortStamp(),
      currentPlayerId: this.id,
      latency: this.state.get('latency') || 0,
      actions: this.serializedActions(),
      ...data
    }

    this.localEvents.emit('remote:update', packet)
    if (this.actions) {
      logger.debug(`Pushed: ${JSON.stringify(this.actions)}`)
      this.actions = null
    }
  }
}
