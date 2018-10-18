import Map from './map'
import MapData from '../../../shared/map_data'
import { load, mapPath } from './map_loader'
const logger = require('../logger').get('maps')
/**
* Contains list of all loaded maps and living entities. Update only maps that have players inside them
*/
export default class MapsManager {
  constructor(game) {
    this.game = game
    this.running = {}
    this.data = {}
    this.game.events.on('map:reload', this.handleMapReload, this)
    //TODO preload all map on start?
  }

  handleMapReload(mapName) {
    logger.debug(`Reloading map: ${mapName}`)
    this.data[mapName] = null

    let maps = Object.values(this.running)
    for (let i = 0; i < maps.length; i++) {
      let map = maps[i]
      if (map.name == mapName) {
        for (let j = 0; j < map.roster.length; j++) {
          let player = map.roster[j]
          player.reload()
        }
      }
    }
  }

  /**
  * Loads and cache Map Data content
  */
  cache(mapName) {
    if (this.data[mapName] == null) {
      logger.debug(`Loading data for ${mapName} from ${mapPath(mapName)}`)
      this.data[mapName] = new MapData(load(mapName))
    }
    return this.data[mapName]
  }

  /**
  * Get existing or load new map
  * @param {String} mapName name of map
  * @param {Player} player used to get information for prefixing instance maps
  * @return {Map} map instance
  */
  get(mapName, player) {
    let mapData = this.cache(mapName)
    // if (mapData.isInstance()) {
    //   mapName = Map.prefix(mapName, player.userId)
    // }

    if (this.running[mapName] == null) {
      this.running[mapName] = new Map(this.game, mapName, mapData)
    }

    return this.running[mapName]
  }

  get instances() {
    return Object.values(this.running)
  }

  /**
  * Update all maps where are players
  */
  updateWorld() {
    Object.values(this.running).forEach((map) => {
      map.updateWorld()

      if (map.rosterEmpty()) {
        logger.info(`Map ${map.id} is empty. Purging from existance`)
        delete this.running[map.id]
        map.destroy()
      }
    })
  }

  /**
  * Send delta packages aboud changed state
  */
  broadcastPackets() {
    Object.values(this.running).forEach((map) => {
      map.broadcastPackets()
    })
  }
}
