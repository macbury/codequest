import deepmerge from 'deepmerge'

export default class WorldUpdatePacket {
  constructor() {
    this.reset()
  }

  reset() {
    this.entities = {}
    this.dirty = false
  }

  get(entityId) {
    if (this.entities[entityId] == null) {
      this.entities[entityId] = {}
    }
    return this.entities[entityId]
  }

  set(entityId, state) {
    let initialState = this.get(entityId)
    this.entities[entityId] = deepmerge(initialState, state)
    this.dirty = true
  }

  addEntity(entity) {
    if (!entity.state.isEmpty()) {
      this.set(entity.id, entity.state.getUpdatePacket())
    }
  }

  addEntities(entites) {
    for (var i = 0; i < entites.length; i++) {
      this.addEntity(entites[i])
    }

    this.dirty = true
  }

  /**
  * Add information that player entered this map/game
  */
  playerEntered(player) {
    this.set(player.id, { entered: true })
    this.addEntity(player)
  }

  playerLeaved(player) {
    this.set(player.id, { leaved: true })
    this.addEntity(player)
  }

  isDirty() {
    return this.dirty
  }

  isClean() {
    return !this.dirty
  }

  toPacket() {
    return {
      entities: Object.values(this.entities)
    }
  }
}
