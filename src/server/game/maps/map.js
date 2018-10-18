import WorldUpdatePacket from '../packets/world_update'
import EntityFactory from '../entities/entity_factory'
import EntityMap from 'shared/entity_map'
import EventEmitter from 'eventemitter3'
import { Trigger } from 'shared/consts'

const logger = require('../logger').get('map')

/**
* Represent world map, where logic of game resides.
*/
export default class Map {
  static prefix(mapName, id) {
    return `${mapName}?${id}`
  }

  static extractMapName(prefixedMapName) {
    return prefixedMapName.split('?')[0]
  }

  constructor(game, id, mapData) {
    logger.info(`Initializing map: ${id}`)
    this.mapData = mapData
    this.events = new EventEmitter()
    this.id = id
    this.name = Map.extractMapName(id)
    this.game = game
    this.players = {}
    this.eventMap = new EntityMap()
    this.entitiesSet = {}
    this.factory = new EntityFactory(this)
    this.worldUpdatePacket = new WorldUpdatePacket()
    this.configureMap()
  }

  /**
  * Load events and create entities
  */
  configureMap() {
    Object.keys(this.mapData.events).forEach((entityId) => {
      let { location, pages } = this.mapData.events[entityId]
      let entity = this.factory.buildEvent({ id: entityId, location, pages })
      this.addEntity(entity)
    })
  }

  /**
  * Search for placed on may by its id
  * @param {string} entityId uuid of entity
  * @return {Entity|Player|null}
  */
  getEntity(entityId) {
    return this.entitiesSet[entityId]
  }

  findPath(target) {
    return this.mapData.findPath(target)
  }

  findEntityAt(query) {
    return this.eventMap.find(query)
  }

  addEntity(entity) {
    logger.debug(`Added entity with id=${entity.id}`)
    this.entitiesSet[entity.id] = entity
    this.worldUpdatePacket.addEntity(entity)
  }

  /**
  * Add player to this map, and broadcast information about this
  */
  addPlayer(player) {
    this.worldUpdatePacket.addEntities(this.entities)

    this.players[player.userId] = player
    this.addEntity(player)
    player.localEvents.emit('enteredMap')
    this.worldUpdatePacket.playerEntered(player)

    logger.info(`Player ${player.userId} entered map ${this.name}`)
    logger.debug(`Player on map ${this.name} is ${this.roster.length}`)
  }

  /**
  * Simple array of players on this map
  */
  get roster() {
    return Object.values(this.players)
  }

  get entities() {
    return Object.values(this.entitiesSet)
  }

  /**
  * Remove player from this map and broadcast information about it
  */
  removePlayer(player) {
    delete this.players[player.userId]
    delete this.entitiesSet[player.id]
    player.localEvents.emit('leavedMap')
    this.worldUpdatePacket.playerLeaved(player)
    logger.info(`Player ${player.userId} exited map ${this.name}`)
  }

  /**
  * Are any players inside map
  */
  rosterEmpty() {
    return this.roster.length == 0
  }

  /**
  * Update world:
  * - NPC
  * - Battles
  * - Players movement
  * - Monsters
  * - Items
  */
  updateWorld(deltaTime) {
    Object.values(this.entitiesSet).forEach((entity) => {
      if (entity.update(deltaTime) || entity.actions) {
        this.worldUpdatePacket.addEntity(entity)
      }
    })

    this.updateObstalces()
  }

  updateObstalces() {
    if (!this.eventMap.isDirty()) {
      return
    }

    this.eventMap.markAsClean()

    let easystar = this.mapData.easystar
    easystar.stopAvoidingAllAdditionalPoints()
    this.eventMap.forEach((location, entities) => {
      for (var i = 0; i < entities.length; i++) {
        let blocking = entities[i].state.get('blocking', false)
        if (blocking) {
          let { col, row } = location
          //logger.debug(`Avoiding: ${JSON.stringify(location)}`)
          easystar.avoidAdditionalPoint(col, row)
          break
        }
      }
    })
  }

  /**
  * Send information about changes to users
  * @param {boolean} force send everything with force
  */
  broadcastPackets(force) {
    if (!force && this.worldUpdatePacket.isClean()) {
      this.events.emit('map:update')
      return
    }

    logger.debug('Sending world update')

    let worldPacket = {
      world: this.worldUpdatePacket.toPacket()
    }

    this.roster.forEach((player) => {
      player.sendUpdate(worldPacket)
    })

    this.worldUpdatePacket.reset()
    this.events.emit('map:update')
  }

  onNextUpdate() {
    return new Promise((resolve) => {
      this.events.once('map:update', resolve)
    })
  }

  /**
  * Cleanup instance from memory
  */
  destroy() {
    this.events.removeAllListeners()
    this.eventMap = null
    this.entities.forEach((entity) => { entity.dispose() })
    this.easystar = null
    this.worldUpdatePacket.reset()
    this.worldUpdatePacket = null
    this.players = null
    this.entitiesSet = null
    this.game = null
    this.mapData = null
  }
}
