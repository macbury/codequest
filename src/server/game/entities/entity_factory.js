import Entity from './entity'
import Event from './components/event'
import Cartographer from './components/cartographer'

const logger = require('server/game/logger').get('EntityFactory')

export default class EntityFactory {
  constructor(map) {
    this.map = map
    this.components = {}
    this.register(Event)
    this.register(Cartographer)
  }

  /**
  * Build entity for event
  */
  buildEvent({ id, location, pages }) {
    let entity = new Entity(id, { id, location }, this.map)
    entity.components.add(Cartographer)
    entity.components.add(Event, pages)

    return entity
  }

  build(id, { components, state, col, row }) {
    let entity = new Entity(id, {...state, id, location: { col, row }}, this.map)
    for (var i = 0; i < components.length; i++) {
      entity.components.add(this.getComponent(components[i]))
    }
    return entity
  }

  register(ComponentType) {
    this.components[ComponentType.name] = ComponentType
  }

  getComponent(componentName) {
    if (this.components[componentName] == null) {
      logger.error(`Undefined component with name: ${componentName}`)
    }
    return this.components[componentName]
  }
}
