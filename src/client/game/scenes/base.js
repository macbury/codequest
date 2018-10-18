import { Scene } from 'phaser'
import FadeManager from '../managers/fade_manager'

export default class BaseScene extends Scene {
  create() {
    this.fade = new FadeManager(this)
    this.events.on('resize', this.onResize, this)
    this.socket.pipe(this.events)
  }

  get store() {
    return this.sys.game.store
  }

  get socket() {
    return this.sys.game.socket
  }

  onResize(width, height) {
    this.cameras.resize(width, height)
  }

  get camera() {
    return this.cameras.main
  }

  goToScene(name, params) {
    this.scene.start(name, params)
    this.destroy()
  }

  destroy() {
    this.events.removeListener('resize', this.onResize)
    this.scene.remove(this.scene.key)
  }
}
