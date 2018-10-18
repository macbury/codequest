import Entity from './entity'

import PlayerCharset from './components/player_charset'
import Movement from './components/movement'
import PlayerSpawn from './components/player_spawn'
import CharacterDepth from './components/character_depth'
import FollowCamera from './components/follow_camera'
import PlayerGuide from './components/player_guide'
import PlayerTrigger from './components/player_trigger'
import PlayerActor from './components/player_actor'
import PlayerCursor from './components/player_cursor'
import NpcCharset from './components/npc_charset'
import Event from './components/event'
import EditorCursor from './components/editor_cursor'
import Cartographer from './components/cartographer'
import EventIndicator from './components/event_indicator'

function extractType(id) {
  return id.split(':')[0]
}

const SharedPlayerComponents = [
  PlayerCharset,
  Movement,
  PlayerSpawn,
  CharacterDepth
]

/**
* Builds entities based on there ids and appends Component to them
*/
export default class EntityFactory {
  constructor(scene) {
    this.recipes = {}
    this.scene = scene

    this.register('picker', [
      EditorCursor
    ])

    this.register('preview', [
      PlayerCharset
    ])

    this.register('p', SharedPlayerComponents)

    this.register('editor-select', [
      CharacterDepth,
      EventIndicator,
      Movement
    ])

    this.register('editor-ev', [
      CharacterDepth,
      NpcCharset,
      EventIndicator,
      Movement
    ])

    this.register('ev', [
      CharacterDepth,
      Movement,
      Event,
      NpcCharset,
      Cartographer
    ])
  }

  register(idPrefix, components) {
    this.recipes[idPrefix] = components
  }

  createCurrentPlayer(id) {
    let entity = new Entity(this.scene, id)
    this.scene.add.existing(entity)

    entity.components.addAll([
      FollowCamera,
      PlayerGuide,
      PlayerTrigger,
      PlayerActor,
      PlayerCursor
    ])

    entity.components.addAll(SharedPlayerComponents)
    entity.localEvents.emit('markCurrentPlayer')
    return entity
  }

  /**
  * Create entity and add it to scene
  * @param {string} entity id
  */
  create(id) {
    let type = extractType(id)
    let recipe = this.recipes[type]

    if (recipe == null) {
      console.log(`Could not find recipe for: ${id}`)
      return null
    }

    let entity = new Entity(this.scene, id)
    this.scene.add.existing(entity)

    let components = this.recipes[type]
    if (components != null) {
      entity.components.addAll(components)
    }

    return entity
  }
}
