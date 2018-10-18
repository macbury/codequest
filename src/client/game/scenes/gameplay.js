import Phaser from 'phaser'
import BaseScene from './base'

import EntityMap from '../../../shared/entity_map'
import { Trigger } from '../../../shared/consts'
import Entity from '../objects/entity'
import ItemsManager from '../managers/items_manager'
import WorldManager from '../managers/world_manager'
import Map from '../map/map'
import MessageWindow from '../ui/message_window'

export default class GameplayScene extends BaseScene {
  init(location) {
    this.location = location
    this.entityMap = new EntityMap()
    this.worldsManager = new WorldManager(this)
    this.map = new Map(this, this.location.map)
    this.messageWindow = new MessageWindow(this)
    this.add.existing(this.messageWindow)
  }

  preload() {
    ItemsManager.preload(this)
    Entity.preload(this)
    this.map.preload()
  }

  create() {
    super.create()
    this.items = new ItemsManager(this)
    this.map.create()

    this.events.once('server:disconnect', this.onDisconnect, this)
    this.events.once('server:reload', this.handleReload, this)
    this.events.on('server:update', this.handleServerUpdate.bind(this))
    this.events.emit('client:ready')
  }

  handleReload() {
    this.events.removeListener('server:disconnect', this.onDisconnect)
    this.events.once('server:disconnect', () => window.location.reload(), this)
    setTimeout(() => { this.socket.disconnect() }, 1000)
  }

  handleServerUpdate(worldDelta) {
    console.log('World delta:', worldDelta)
    this.worldsManager.handleServerUpdate(worldDelta)
  }

  update() {
    if (!this.entityMap.isDirty()) {
      return
    }

    this.entityMap.markAsClean()

    let { easystar } = this.map.data
    easystar.stopAvoidingAllAdditionalPoints()
    this.entityMap.forEach((location, entities) => {
      for (var i = 0; i < entities.length; i++) {
        let { trigger } = entities[i].state
        if (trigger == Trigger.Click) {
          let { col, row } = location
          easystar.avoidAdditionalPoint(col, row)
          break
        }
      }
    })
  }

  /**
  * Go to other GameplayScene and load new map
  * @param {Location} location location to go to
  */
  goToMap({ map, col, row }) {
    let sceneKey = `map/${map}`
    this.scene.add(sceneKey, GameplayScene)
    this.scene.start(sceneKey, { map, col, row })
    this.destroy()
  }

  onDisconnect() {
    this.goToScene('connection')
  }
}
