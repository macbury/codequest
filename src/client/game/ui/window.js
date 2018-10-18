import Phaser from 'phaser'
import { LAYER_UI_MESSAGES } from '../rendering'
import { Align } from '../../../shared/consts'

export default class Window extends Phaser.GameObjects.Group {
  constructor(scene, width, height) {
    super(scene)
    this.x = 0
    this.y = 0
    this.width = width
    this.height = height
    this.align = Align.Bottom
    this.visible = false

    this.background = this.create(0, 0, 'ui', 'window/background.png')
    this.background.depth = LAYER_UI_MESSAGES
    this.background.setOrigin(0,0)
    this.add(this.background)

    this.topLeftFrame = this.create(0,0,'ui', 'window/frame-top-left.png')
    this.topLeftFrame.depth = LAYER_UI_MESSAGES
    this.topLeftFrame.setOrigin(0,0)
    this.add(this.topLeftFrame)

    this.topFrame = this.create(0,0,'ui', 'window/frame-top.png')
    this.topFrame.depth = LAYER_UI_MESSAGES
    this.topFrame.setOrigin(0,0)
    this.add(this.topFrame)

    this.topRightFrame = this.create(0,0,'ui', 'window/frame-top-right.png')
    this.topRightFrame.depth = LAYER_UI_MESSAGES
    this.topRightFrame.setOrigin(0,0)
    this.add(this.topRightFrame)

    this.leftFrame = this.create(0,0,'ui', 'window/frame-left.png')
    this.leftFrame.depth = LAYER_UI_MESSAGES
    this.leftFrame.setOrigin(0,0)
    this.add(this.leftFrame)

    this.bottomLeftFrame = this.create(0,0,'ui', 'window/frame-bottom-left.png')
    this.bottomLeftFrame.depth = LAYER_UI_MESSAGES
    this.bottomLeftFrame.setOrigin(0,0)
    this.add(this.bottomLeftFrame)

    this.bottomFrame = this.create(0,0,'ui', 'window/frame-bottom.png')
    this.bottomFrame.depth = LAYER_UI_MESSAGES
    this.bottomFrame.setOrigin(0,0)
    this.add(this.bottomFrame)

    this.bottomRightFrame = this.create(0,0,'ui', 'window/frame-bottom-right.png')
    this.bottomRightFrame.depth = LAYER_UI_MESSAGES
    this.bottomRightFrame.setOrigin(0,0)
    this.add(this.bottomRightFrame)

    this.bottomRight = this.create(0,0,'ui', 'window/frame-right.png')
    this.bottomRight.depth = LAYER_UI_MESSAGES
    this.bottomRight.setOrigin(0,0)
    this.add(this.bottomRight)

    Phaser.Actions.SetAlpha(this.children.entries, 0.0)
  }

  get backgroundScaleX() {
    return this.width / 32
  }

  get backgroundScaleY() {
    return this.height / 32
  }

  get camera() {
    return this.scene.cameras.main
  }

  preUpdate(time, delta) {
    this.background.visible = this.visible

    if (this.visible) {
      if (this.align == Align.Center) {
        this.x = (this.camera.width - this.width) / 2 + this.camera.scrollX
        this.y = (this.camera.height - this.height) / 2 + this.camera.scrollY
      } else if (this.align == Align.Bottom) {
        this.x = (this.camera.width - this.width) / 2 + this.camera.scrollX
        this.y = (this.camera.height - this.height - 20) + + this.camera.scrollY
      }

      this.background.x = this.x
      this.background.y = this.y

      this.topLeftFrame.x = this.x - 2
      this.topLeftFrame.y = this.y - 2
      this.topFrame.x = this.x + 2
      this.topFrame.y = this.y - 2
      this.topRightFrame.x = this.x + this.width - 2
      this.topRightFrame.y = this.y - 2
      this.leftFrame.x = this.x - 2
      this.leftFrame.y = this.y + 2
      this.bottomLeftFrame.x = this.x - 2
      this.bottomLeftFrame.y = this.y + this.height - 2
      this.bottomFrame.x = this.x + 2
      this.bottomFrame.y = this.y + this.height
      this.bottomRightFrame.x = this.x + this.width - 2
      this.bottomRightFrame.y = this.y + this.height - 3
      this.bottomRight.x = this.x + this.width
      this.bottomRight.y = this.y + 3

      this.topFrame.scaleX = this.width - 4
      this.leftFrame.scaleY = this.height - 4
      this.bottomFrame.scaleX = this.width - 3
      this.bottomRight.scaleY = this.height - 6
      this.background.scaleX = this.backgroundScaleX
      this.background.scaleY = this.backgroundScaleY
    }

    super.preUpdate(time, delta)
  }

  open() {
    return new Promise((resolve) => {
      if (this.closeTween != null) {
        this.closeTween.stop()
        this.closeTween = null
        resolve()
      } else if (this.isClosed()) {
        Phaser.Actions.SetAlpha(this.children.entries, 0.0)
        this.visible = true
        this.scene.tweens.add({
          targets: this.children.entries,
          duration: 200,
          alpha: 1.0,
          onComplete: resolve
        })
      } else {
        resolve()
      }
    })
  }

  isClosed() {
    return !this.visible
  }

  close() {
    return new Promise((resolve) => {
      if (this.isClosed()) {
        resolve()
      } else {
        this.closeTween = this.scene.tweens.add({
          targets: this.children.entries,
          duration: 200,
          alpha: 0.0,
          delay: 500,
          onComplete: () => {
            this.visible = false
            this.closeTween = null
            resolve()
          }
        })
      }
    })
  }
}
