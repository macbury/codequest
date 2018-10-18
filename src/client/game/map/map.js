import { BACKGROUND_LAYER, DETAILS_LAYER, OVERLAY_LAYER } from '../rendering'
import { TILE_SIZE } from '../../../shared/consts'
import MapData from '../../../shared/map_data'
import _ from 'underscore'

import townTilesetImagePath from '../../../../data/maps/tilesets/town.png'
import interiorTilesetImagePath from '../../../../data/maps/tilesets/interior.png'
import dungeonTilesetImagePath from '../../../../data/maps/tilesets/dungeon.png'

export default class Map {
  constructor(scene, name) {
    this.name = name
    this.scene = scene
  }

  loadLayer(layerName) {
    return this.tilemap.createDynamicLayer(layerName, this.tileset, 0, 0)
  }

  preload() {
    this.scene.load.image('interior', interiorTilesetImagePath)
    this.scene.load.image('town', townTilesetImagePath)
    this.scene.load.image('dungeon', dungeonTilesetImagePath)
    this.scene.load.tilemapTiledJSON(`${this.name}Map`, this.mapDataPath)
  }

  get mapDataPath() {
    return `/api/maps/${this.name}`
  }

  get width() {
    return this.layers.background.width
  }

  get height() {
    return this.layers.background.height
  }

  create() {
    this.tilemap = this.scene.make.tilemap({ key: `${this.name}Map` })
    this.data = new MapData(this.tilemap)

    let tilesetImage = this.tilemap.tilesets[0].name
    this.tileset = this.tilemap.addTilesetImage(tilesetImage)

    this.layers = {
      background: this.loadLayer('background'),
      details: this.loadLayer('details'),
      overlay: this.loadLayer('overlay')
    }

    this.layers.background.depth = BACKGROUND_LAYER
    this.layers.details.depth = DETAILS_LAYER
    this.layers.overlay.depth = OVERLAY_LAYER

    this.layers.background.setInteractive()

    this.layers.background.on('pointerdown', _.throttle(this.handleMapClick.bind(this), 500))
    this.layers.background.on('pointermove', this.handleMouseMove, this)
    this.layers.background.on('pointerup', this.handleMouseUp, this)
  }

  pointerToTile(pointer) {
    let position = { x: 0, y: 0 }
    this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y, position)

    let col = Math.floor(position.x / TILE_SIZE)
    let row = Math.floor(position.y / TILE_SIZE)
    let x   = col * TILE_SIZE
    let y   = row * TILE_SIZE
    return { col, row, x, y }
  }

  handleMouseMove(pointer) {
    let tile = this.pointerToTile(pointer)
    let passable = this.data.isPassable(tile)
    this.scene.events.emit('map:tileHover', { tile, passable })
    this.scene.events.emit('map:mouseMove', { tile, passable })
  }

  handleMouseUp(pointer) {
    let tile = this.pointerToTile(pointer)
    let passable = this.data.isPassable(tile)
    this.scene.events.emit('map:mouseUp', { tile, passable })
  }

  handleMapClick(pointer) {
    let tile = this.pointerToTile(pointer)
    if (this.data.isPassable(tile)) {
      this.scene.events.emit('map:passableTileClicked', { tile, pointer })
    }

    this.scene.events.emit('map:tileClicked', { tile, pointer })
  }
}
