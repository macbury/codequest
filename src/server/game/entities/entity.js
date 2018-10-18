import EventEmitter from 'eventemitter3'
import ComponentsManager from 'shared/components_manager'
import State from './attributes'
import { tileDistance } from 'shared/map_utils'

export default class Entity {
  constructor(id, state, map) {
    this.components = new ComponentsManager(this)
    this.currentMap = map
    this.id = id
    /**
    * State informations are sended after update to clients
    */
    this.state = new State(state)

    this.localEvents = new EventEmitter()
  }

  /**
  * Logic that updates player, like moving, attacking buffing and others
  */
  update() {
    try {
      this.components.update()
      return this.state.isDirty()
    } finally {
      this.state.markAsClean()
    }
  }

  /**
  * Distance to entity
  * @return {fixnum} Distance in tiles
  */
  distanceToEntity(otherEntity) {
    let currentEntityLocation = this.state.get('location', {})
    let otherEntityLocation = otherEntity.state.get('location', {})
    return tileDistance(currentEntityLocation, otherEntityLocation)
  }

  get switches() {
    return this.currentMap.game.switches
  }

  dispose() {
    this.components.dispose()
    this.localEvents.removeAllListeners()
  }
}
