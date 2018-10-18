import BaseScene from './base'
import GameplayScene from './gameplay'
import CharacterSetupScene from './character_setup'
import Dialog from '../ui/dialog'
import { Align } from '../../../shared/consts'

/**
* Initialize connection and wait on connect message
*/
export default class ConnectionScene extends BaseScene {
  create() {
    super.create()
    this.statusWindow = new Dialog(this, 200, 30)
    this.add.existing(this.statusWindow)
    this.statusWindow.align = Align.Center
    this.statusWindow.setText('Connecting...')

    this.statusWindow.open()
    this.fade.fadeIn(() => {
      this.events.once('server:boot', this.onBoot, this)
      this.events.once('server:startSetup', this.onStartSetup, this)
      this.events.on('server:errors', this.handleServerError, this)
      this.socket.pipe(this.events)
      this.socket.setupOnce()
    })
  }

  handleServerError({ message }) {
    this.statusWindow.setText(message)
  }

  onBoot(location) {
    this.fade.fadeOut(() => {
      let { map } = location
      let sceneKey = `map/${map}`
      this.scene.add(sceneKey, GameplayScene)
      this.scene.start(sceneKey, location)
    })
  }

  onStartSetup() {
    this.fade.fadeOut(() => {
      this.scene.add('characterSetup', CharacterSetupScene)
      this.scene.start('characterSetup')
    })
  }
}
