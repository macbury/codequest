import Base from './base'
import { SELECTION_LAYER } from '../../rendering'
import { tileToWorldPosition } from '../../../../shared/map_utils'

/**
* Kontroluje kursor i chuj.
*/
export default class PlayerCursor extends Base {
  init() {
    this.generateUiAnimation('target/valid')

    this.targetCursor = this.scene.add.sprite(-90, -90, 'ui', 'target/valid')
    this.targetCursor.setOrigin(0, 0)
    this.targetCursor.anims.play('target/valid')
    this.targetCursor.depth = SELECTION_LAYER

    this.hoverCursor = this.scene.add.sprite(-90, -90, 'ui', 'target/hover.png')
    this.hoverCursor.setOrigin(0, 0)
    this.hoverCursor.setTint(0xffffff)
    this.hoverCursor.alpha = 0.5
    this.hoverCursor.depth = SELECTION_LAYER + 0.1
    this.enabled = true

    this.on('map:passableTileClicked', this.handleTileClicked)
    this.on('map:tileHover', this.handleTileHover)

    this.localEvents.on('acting:finish', this.enableCursor, this)
    this.localEvents.on('acting:begin', this.disableCursor, this)
    this.localEvents.on('movement:finished', this.hideCursor, this)
  }

  disableCursor() {
    this.enabled = false
    this.hideCursor()
  }

  enableCursor() {
    this.enabled = true
  }

  showCursor() {
    this.targetCursor.visible = this.hoverCursor.visible = true
  }

  hideCursor() {
    this.targetCursor.visible = this.hoverCursor.visible = false
  }

  handleTileClicked({ tile }) {
    if (!this.enabled) {
      return
    }
    this.showCursor()
    this.targetCursor.x = tile.x
    this.targetCursor.y = tile.y
  }

  handleTileHover({ tile, passable }) {
    if (!this.enabled) {
      return
    }
    this.hoverCursor.visible = true
    this.hoverCursor.x = tile.x
    this.hoverCursor.y = tile.y

    if (passable) {
      this.hoverCursor.setTint(0xffffff)
    } else {
      this.hoverCursor.setTint(0xff0000)
    }
  }

  dispose() {
    this.off('map:passableTileClicked', this.handleTileClicked)
    this.off('map:tileHover', this.handleTileHover)
    this.localEvents.removeListener('acting:finish', this.enableCursor, this)
    this.localEvents.removeListener('acting:begin', this.disableCursor, this)
    this.hoverCursor.destroy()
    this.targetCursor.destroy()
    this.targetCursor = null
  }

  generateUiAnimation(animationName, framesIndicies=[1,2,3,4]) {
    if (this.scene.anims.anims.has(animationName)) {
      return animationName
    }

    let frames = this.scene.anims.generateFrameNames('ui', {
      prefix: animationName,
      suffix: '.png',
      frames: framesIndicies
    })

    this.scene.anims.create({
      key: animationName,
      frames: frames,
      frameRate: 15,
      repeat: -1
    })

    return animationName
  }
}
