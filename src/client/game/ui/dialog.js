import Window from './window'
import { LAYER_UI_MESSAGES } from '../rendering'

export default class Dialog extends Window {
  constructor(scene, width, height) {
    super(scene, width, height)

    this.shadow = this.scene.add.bitmapText(0, 0, 'main', '')
    this.shadow.depth = LAYER_UI_MESSAGES + 1
    this.shadow.tint = 0x000000
    this.shadow.alpha = 0.6
    this.add(this.shadow)

    this.text = this.scene.add.bitmapText(0, 0, 'main', '')
    this.text.depth = LAYER_UI_MESSAGES + 2
    this.add(this.text)
    Phaser.Actions.SetAlpha(this.children.entries, 0.0)
  }

  setText(newText) {
    this.text.setText(newText)
    this.shadow.setText(newText)
  }

  clear() {
    this.text.setText('')
    this.shadow.setText('')
  }

  close() {
    this.clear()
    return super.close()
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (this.visible) {
      this.text.x = this.x + 10
      this.text.y = this.y + 10
      this.shadow.x = this.text.x + 1
      this.shadow.y = this.text.y + 1
    }
    this.shadow.visible = this.text.visible = this.visible
  }
}
