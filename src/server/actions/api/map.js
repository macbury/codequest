import { raw, exists, save, findEventLayer } from '../../game/maps/map_loader'
import { MAPS_DIR } from 'server/paths'

const Glob = require('glob-fs')

export function getMap (req, res, next) {
  let id = req.params[0]
  if (exists(id)) {
    let mapObj = raw(id, false)
    res.json(mapObj)
  } else {
    next()
  }
}

// create events layer
// add event to layer

function buildEventLayer() {
  return {
   color: "#0000ff",
   draworder: "topdown",
   name: "events",
   objects: [],
   opacity: 1,
   type: "objectgroup",
   visible: true,
   x: 0,
   y: 0
  }
}

function loadMap(mapName) {
  if (exists(mapName)) {
    let mapObj = raw(mapName, true, false)
    let eventLayer = findEventLayer(mapObj)
    if (eventLayer == null) {
      eventLayer = buildEventLayer()
      mapObj.layers.push(eventLayer)
    }
    return { map: mapObj, eventLayer }
  } else {
    return {}
  }
}

function transformEventToTiledFormat(event) {
  let pages = event.pages
  delete event.pages
  event.properties = {
    pages: JSON.stringify(pages)
  }
  return event
}

export function updateMapEvent(req, res) {
  let game = req.app.get('game')
  let mapName = req.params[0]
  let { id } = req.params
  let { map, eventLayer } = loadMap(mapName)

  if (map) {
    let { event } = req.body
    eventLayer.objects = eventLayer.objects.map((existingEvent) => {
      if (id == existingEvent.id) {
        return transformEventToTiledFormat(event)
      } else {
        return existingEvent
      }
    })
    save(mapName, map)
    res.json(map)
    game.events.emit('map:reload', mapName)
  } else {
    next()
  }
}

export function createMapEvent(req, res, next) {
  let game = req.app.get('game')
  let mapName = req.params[0]
  let { map, eventLayer } = loadMap(mapName)
  if (map) {
    let { event } = req.body

    eventLayer.objects.push(transformEventToTiledFormat(event))
    save(mapName, map)
    res.json(map)
    game.events.emit('map:reload', mapName)
  } else {
    next()
  }
}

export function getMapEvents (req, res, next) {
  let id = req.params[0]
  if (exists(id)) {
    let mapObj = raw(id, true)
    res.json(mapObj)
  } else {
    next()
  }
}

export function getMaps (req, res) {
  Glob().readdir('./data/maps/**/*.json', (err, files) => {
    let maps = files.filter((file) => !file.match('tilesets'))
      .map((file) => file.replace('data/maps/', '').replace('.json', ''))
    res.json({ maps })
  })
}
