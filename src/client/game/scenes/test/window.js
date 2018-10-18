import BaseScene from '../base'
import MessageWindow from '../../ui/message_window'
import Entity from '../../objects/entity'
/**
* Test charset assembly
*/
export default class WindowTest extends BaseScene {

  preload() {
    Entity.preload(this)
  }

  create() {
    let window = new MessageWindow(this)
    window.open().then(() => {
      window.showText("Wot? This should word wrap this text around! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Eugenia", 'Chara1/1').then(() => {
        window.showText("No way!?").then(() => {
          window.showText("How is this sorcery working...").then(() => {
            window.close()
          })
        })
      })
    })

    this.add.existing(window)
  }
}
