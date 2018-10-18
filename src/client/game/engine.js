import CoreEngine from './core'
import BootScene from './scenes/boot'
import ConnectionScene from './scenes/connection'

export default class Engine extends CoreEngine {
  create() {
    super.create()
    this.scene.add('connection', ConnectionScene)
    this.scene.add('boot', BootScene, true)
  }
}
