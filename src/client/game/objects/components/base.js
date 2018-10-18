import Component from '../../../../shared/component'

export default class Base extends Component {
  /**
  * Method that gets entity state from server
  * @abstract
  * @param {object} entityState state
  */
  handleServerUpdate(state) {}

  /**
  * List all phaser elements added to entity(Phaser.Group)
  */
  get children() {
    return this.entity.children
  }

  get scene() {
    return this.entity.scene
  }

  get state() {
    return this.entity.state
  }

  get items() {
    return this.scene.items
  }

  get world() {
    return this.scene.worldsManager
  }

  get id() {
    return this.entity.id
  }

  on(eventName, callback) {
    this.events.on(eventName, callback, this)
  }

  emit(eventName, data) {
    this.events.emit(eventName, data)
  }

  off(eventName, callback) {
    this.events.removeListener(eventName, callback, this)
  }

  get events() {
    return this.scene.events
  }

  get entityMap() {
    return this.scene.entityMap
  }

  get localEvents() {
    return this.entity.localEvents
  }

  createSprite() {
    let part = this.scene.add.sprite(0, 0, 'charactersAtlas')
    part.setOrigin(0.5, 0.5)
    this.entity.add(part)
    return part
  }
}
