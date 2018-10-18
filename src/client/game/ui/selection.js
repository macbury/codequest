import Phaser from 'phaser'
import { LAYER_UI_MESSAGES } from '../rendering'

export default class Selection {
  constructor(parent) {
    this.parent = parent

    this.x = 0
    this.y = 0
    this.width = 100

    this.left = parent.create(0, 0, 'ui', 'selection/selection-left.png')
    this.left.depth = LAYER_UI_MESSAGES
    this.left.setOrigin(0,0)
    this.parent.add(this.left)

    this.center = parent.create(0, 0, 'ui', 'selection/selection-center.png')
    this.center.depth = LAYER_UI_MESSAGES
    this.center.setOrigin(0,0)
    this.parent.add(this.center)

    this.right = parent.create(0, 0, 'ui', 'selection/selection-right.png')
    this.right.depth = LAYER_UI_MESSAGES
    this.right.setOrigin(0,0)
    this.parent.add(this.right)

    this.shadow = parent.scene.add.bitmapText(0, 0, 'main', '')
    this.shadow.depth = LAYER_UI_MESSAGES + 1
    this.shadow.tint = 0x000000
    this.shadow.alpha = 0.6
    this.parent.add(this.shadow)

    this.text = parent.scene.add.bitmapText(0, 0, 'main', '')
    this.text.depth = LAYER_UI_MESSAGES + 2
    this.parent.add(this.text)
  }

  get value() {
    return this.text.getText()
  }

  set value(newText) {
    this.text.setText(newText)
    this.shadow.setText(newText)
  }

  update() {
    this.left.x = this.x
    this.left.y = this.y

    this.center.x = this.x + this.left.width
    this.center.y = this.y
    this.center.scaleX = this.width - this.left.width

    this.right.x = this.x + (this.width - this.left.width)
    this.right.y = this.y


  }
}
