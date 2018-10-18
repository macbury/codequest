import BaseScene from '../base'
import { TILE_SIZE } from '../../../../shared/consts'
import Map from '../../map/map'
import Entity from '../../objects/entity'
import EntityFactory from '../../objects/entity_factory'
import uiImagePath from '../../../../assets/ui.png'
import uiAtlasPath from '../../../../assets/ui.json'
/**
* Just preload basic ui assets as quick possible and move to screen with connecting
*/
export default class MapEditorScene extends BaseScene {
  init({ map }) {
    this.factory = new EntityFactory(this)
    this.map = new Map(this, map)
  }

  preload() {
    Entity.preload(this)
    this.load.atlas('ui', uiImagePath, uiAtlasPath)
    this.map.preload()
  }

  get scrollerDiv() {
    return this.sys.game.container.parentElement.parentElement
  }

  get camera() {
    return this.cameras.main
  }

  get scroll() {
    return JSON.parse(localStorage.getItem(`map:${this.map.name}:scroll`) || "{ \"left\": 0, \"top\": 0}")
  }

  create() {
    super.create()
    this.map.create()
    this.fade.clear()
    this.existingEvents = {}
    this.sys.game.events.emit('map:sizeChanged', {
      mapWidth: this.map.tilemap.widthInPixels,
      mapHeight: this.map.tilemap.heightInPixels
    })
    this.factory.create('picker:picker')
    this.events.on('edit:updateEvents', this.updateEvents, this)
    this.sys.game.events.emit('mapScene:boot', this)

    this.scrollerDiv.scrollLeft = this.scroll.left
    this.scrollerDiv.scrollTop = this.scroll.top
  }

  updateEvents(events) {
    Object.keys(events).forEach((eventId) => {
      let event = events[eventId]
      let state = {
        location: {
          col: event.x / TILE_SIZE,
          row: event.y / TILE_SIZE
        }
      }

      if (event.pages) {
        state = {...state, ...event.pages[0].state}
      }

      if (!this.existingEvents[eventId]) {
        this.existingEvents[eventId] = this.factory.create('editor-'+eventId)
      }

      this.existingEvents[eventId].handleServerUpdate(state)
    })
  }

  update() {
    super.update()
    let nsx = this.scrollerDiv.scrollLeft  //TODO move to scale const?
    let nsy = this.scrollerDiv.scrollTop / 2

    if (this.camera.scrollX != nsx || this.camera.scrollY != nsy) {
      this.camera.scrollX = nsx
      this.camera.scrollY = nsy
      localStorage.setItem(`map:${this.map.name}:scroll`, JSON.stringify({ left: nsx, top: nsy }))
    }

  }
}
