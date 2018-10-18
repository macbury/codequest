import Base from './base'
import { Direction } from '../../../../shared/consts'
import { generateCharsetAnimation } from '../../utils/animation'
/**
* Handles loading npc charset
*/
export default class NpcCharset extends Base {
  handleServerUpdate({ charset, direction }) {
    if (charset != null) {
      this.charset = charset
      this.direction = Direction.get(direction)
      let animDown = generateCharsetAnimation(this.scene, [this.charset, this.direction.key.toLowerCase()].join('/'))
      this.sprite.play(animDown)
      this.sprite.anims.stop()
      this.sprite.visible = true
    } else if (this._sprite) {
      this.destroySprite()
    }
  }

  get sprite() {
    if (!this._sprite) {
      this._sprite = this.createSprite()
    }

    return this._sprite
  }

  update() {
    // if (this._sprite != null) {
    //   this.sprite.x = this.entity.x
    //   this.sprite.y = this.entity.y
    //   this.sprite.depth = this.entity.depth
    // }
  }

  destroySprite() {
    if (this._sprite) {
      this._sprite.destroy()
      this._sprite = null
    }
  }

  dispose() {
    this.destroySprite()
    super.dispose()
  }
}
