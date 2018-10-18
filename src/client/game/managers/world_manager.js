import EntityFactory from '../objects/entity_factory'

export default class WorldManager {
  constructor(scene) {
    this.scene = scene
    this.scene.events.on('entity:destroyed', this.onEntityDestruction, this)
    this.scene.events.on('world:pause', this.pause, this)
    this.scene.events.on('world:resume', this.resume, this)
    this.entityFactory = new EntityFactory(scene)
    this.latency = 0
    this.currentPlayerId = 'empty'
    this.entities = {}
    this.cachedStates = []
  }

  onEntityDestruction(entityId) {
    delete this.entities[entityId]
  }

  pause() {
    console.log('pausing....')
    this._pause = true
  }

  resume() {
    console.log('resume....')
    this._pause = false
    for (var i = 0; i < this.cachedStates.length; i++) {
      this.processState(this.cachedStates[i])
    }
    this.cachedStates = []
  }

  emit(eventName, data) {
    this.scene.events.emit(eventName, data)
  }

  handleServerUpdate(worldDeltaState) {
    if (this._pause) {
      console.log('cacgin....')
      this.cachedStates.push(worldDeltaState)
    } else {
      console.log('process....')
      this.processState(worldDeltaState)
    }
  }

  processState({ world, currentPlayerId, latency, actions }) {
    this.latency = latency
    this.currentPlayerId = currentPlayerId

    if (world && world.entities) {
      let { entities } = world
      for (var i = 0; i < entities.length; i++) {
        let entity = entities[i]
        this.updateEntity(entity)
      }
    }

    this.scene.events.emit('handleDirectorActions', actions)
  }

  updateEntity(state) {
    let entityId = state.id
    let entity = null
    if (!this.entityExists(entityId)) {
      if (entityId == this.currentPlayerId) {
        entity = this.entityFactory.createCurrentPlayer(entityId)
        this.scene.events.emit('currentPlayerSpawned')
      } else {
        entity = this.entityFactory.create(entityId)
      }

      if (entity == null) {
        return
      }
      this.entities[entityId] = entity
    }

    this.entities[entityId].handleServerUpdate(state)
  }

  entityExists(entityId) {
    return this.entities[entityId] != null
  }
}
