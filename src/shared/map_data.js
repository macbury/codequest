const EasyStar = require('easystarjs')

const TILE_OBSTALCE = 0
const TILE_PASSABLE = 1

/**
* Find gids with obstalce attribute
*/
function findAcceptableIds(tilesets) {
  let accaptableTileIds = [-1]
  let startGid = 1
  for (var i = 0; i < tilesets.length; i++) {
    let tileProperties = tilesets[i].tileproperties || tilesets[i].tileProperties
    Object.keys(tileProperties).forEach((tileId) => {
      if (!tileProperties[tileId].obstalce) {
        accaptableTileIds.push(startGid + parseInt(tileId))
      }
    })
  }
  return accaptableTileIds
}

function namedLayers(layers) {
  let output = {}
  for (let layerId in layers) {
    let layer = layers[layerId]
    output[layer.name] = layer
  }
  return output
}

/**
* Generate just simple 2d array of map with gids that are passable
*/
function flattenMap(rawLayers, tilesets, rows, cols) {
  let accaptableTileIds = findAcceptableIds(tilesets)
  let layers = namedLayers(rawLayers)
  let grid = new Array(rows)

  for (var row = 0; row < rows; row++) {
    if (grid[row] == null) {
      grid[row] = new Array(col)
    }

    for (var col = 0; col < cols; col++) {
      let backgroundIndex = layers.background.data[row][col].index
      let detailsIndex = layers.details.data[row][col].index

      let isPassable = (accaptableTileIds.indexOf(backgroundIndex) != -1)
                          && (accaptableTileIds.indexOf(detailsIndex) != -1)
      if (isPassable) {
        grid[row][col] = TILE_PASSABLE
      } else {
        grid[row][col] = TILE_OBSTALCE
      }
    }
  }

  return grid
}

/**
* Parse interesting informations about map
* Contains tile grid with ids of passable tiles, and -Infinity for not passable
*/
export default class MapData {
  /**
  * Parse and load data
  */
  constructor({ width, height, tilesets, layers, entities }) {
    this.accaptableTileIds = [TILE_PASSABLE]
    this.tileGrid = flattenMap(layers, tilesets, height, width, this.accaptableTileIds)

    this.entities = entities

    this.cols = width
    this.rows = height
    this.configurePathFinding()
  }

  get events() {
    return this.entities.events || []
  }

  /**
  * This type of map that have only one player, and each new player gets own version of this instance
  * @return {Boolean} true if yes
  */
  isInstance() {
    return true
  }

  isPassable({col, row}) {
    return this.tileGrid[row][col] != TILE_OBSTALCE
  }

  configurePathFinding() {
    this.easystar = new EasyStar.js()
    this.easystar.enableSync()
    this.easystar.setAcceptableTiles(this.accaptableTileIds)
    this.easystar.setGrid(this.tileGrid)
  }

  findPath({ start, end }) {
    let finalPath = []
    this.easystar.findPath(start.col, start.row, end.col, end.row, (path) => {
      if (path != null) {
        finalPath = path.map(({x,y}) => { return { row: y, col: x } })
      }
    })
    this.easystar.calculate()
    return finalPath
  }
}
