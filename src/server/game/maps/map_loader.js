import fs from 'fs'
import path from 'path'
import { MAPS_DIR, TILESETS_PATH } from '../../paths'
import ParseTileLayers from './parse_tile_layers'
import { worldToTile } from 'shared/map_utils'
import { Direction } from 'shared/consts'

export function findEventLayer(mapObj) {
  return mapObj.layers.find(({ type }) => type == 'objectgroup')
}

export function mapPath(id) {
  return path.join(MAPS_DIR, `${id}.json`)
}

function extractEvents({ objects }, mapStorage) {
  let output = {}
  for (let i = 0; i < objects.length; i++) {
    let event = {...objects[i]}
    let location = worldToTile(event)

    let pages = JSON.parse(event.properties.pages || "{}")
    delete event.properties

    output[`ev:${event.id}`] = {
      pages,
      location,
      ...event
    }
  }
  return output
}

export function save(id, mapObj) {
  let mapFilePath = mapPath(id)
  let data = {...mapObj}
  delete data.entities
  fs.writeFile(mapFilePath, JSON.stringify(data, null, 2))
}

/**
* Load raw data representation without base decoded tiles
*/
export function raw(id, loadEvents = false, loadTilesets = true) {
  let mapFilePath = mapPath(id)
  let mapStorage = path.dirname(mapFilePath)
  let mapObj = JSON.parse(fs.readFileSync(mapFilePath))
  let { tilesets, layers } = mapObj

  if (loadTilesets) {
    for (let i = 0; i < tilesets.length; i++) {
      let { source, firstgid } = tilesets[i]
      let tilesetPath = path.join(TILESETS_PATH, path.basename(source))
      let loadedTileset = JSON.parse(fs.readFileSync(tilesetPath))
      tilesets[i] = Object.assign(loadedTileset, { firstgid })
    }
  }

  mapObj.layers = []
  mapObj.entities = {}
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i]
    if (layer.type == 'tilelayer') {
      mapObj.layers.push(layer)
    } else if (loadEvents && layer.type == 'objectgroup') {
      mapObj.layers.push(layer)
      mapObj.entities[layer.name] = extractEvents(layer, mapStorage)
    }
  }

  return mapObj
}

/**
* Load and parse layers
*/
export function load(id) {
  let mapObj = raw(id, true)
  mapObj.layers = ParseTileLayers(mapObj)
  return mapObj
}

/**
* Check if there is a map with this id
*/
export function exists(id) {
  return fs.existsSync(mapPath(id))
}
