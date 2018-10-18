import Base from './base'
import { SELECTION_LAYER } from '../../rendering'

/**
* Check where player clicked
* allow to drag events
* support click right
*/
export default class EditorCursor extends Base {
  init() {
    this.hoverCursor = this.scene.add.sprite(-90, -90, 'ui', 'target/hover.png')
    this.hoverCursor.setOrigin(0, 0)
    this.hoverCursor.setTint(0xffffff)
    this.hoverCursor.alpha = 0.5
    this.hoverCursor.depth = SELECTION_LAYER + 0.1

    this.on('map:tileClicked', this.handleTileClicked)
    this.on('map:tileHover', this.handleTileHover)
  }

  handleTileClicked() {

  }

  handleTileHover({ tile }) {
    this.hoverCursor.visible = true
    this.hoverCursor.x = tile.x
    this.hoverCursor.y = tile.y

    this.hoverCursor.setTint(0xffffff)
  }

  dispose() {
    this.off('map:tileClicked', this.handleTileClicked)
    this.off('map:tileHover', this.handleTileHover)
    this.targetCursor.destroy()
    this.targetCursor = null
  }
}
