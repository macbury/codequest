import Phaser from 'phaser'
import ComponentsManager from '../../../shared/components_manager'

import { HALF_TILE_SIZE, TILE_SIZE } from '../../../shared/consts'
import { CHARACTERS_LAYER } from '../rendering'

import { tileToCharsetWorldPosition } from '../../../shared/map_utils'

import charasImagePath from '../../../assets/characters/charas.png'
import charasAtlasPath from '../../../assets/characters/charas.json'

import facesetsImagePath from '../../../assets/facesets.png'
import facesetsAtlasPath from '../../../assets/facesets.json'

export default class Entity extends Phaser.GameObjects.Container {
  constructor(scene, id) {
    super(scene)
    this.id = id
    this.x = 0
    this.y = 0
    this.state = {}
    this.alive = true
    this.depth = CHARACTERS_LAYER
    this.components = new ComponentsManager(this)
    this.localEvents = new Phaser.EventEmitter()
  }

  setTile(tile) {
    tileToCharsetWorldPosition(tile, this)
  }

  get tile() {
    return { col: this.col, row: this.row }
  }

  get col() {
    return Math.floor((this.x - HALF_TILE_SIZE) / TILE_SIZE)
  }

  get row() {
    return Math.floor(this.y / TILE_SIZE)
  }

  /**
  * Update entity with information from server
  */
  handleServerUpdate(entityData) {
    for (var i = 0; i < this.components.data.length; i++) {
      this.components.data[i].handleServerUpdate(entityData)
    }
  }

  preUpdate(time, delta) {
    this.components.update()
  }

  destroy() {
    if (this.scene != null) {
      this.scene.events.emit('entity:destroyed', this.id)
    }

    this.components.dispose()
    this.localEvents.destroy()
    super.destroy()
  }

  static preload(scene) {
    scene.load.atlas('charasAtlas', charasImagePath, charasAtlasPath)
    scene.load.atlas('facesetsAtlas', facesetsImagePath, facesetsAtlasPath)
  }
}
