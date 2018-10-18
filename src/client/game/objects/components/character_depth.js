import Base from './base'
import { CHARACTERS_LAYER } from '../../rendering'
/**
* Calculate depth of whole entity based on its y position on map
*/
export default class CharacterDepth extends Base {
  init() {
    this.prevY = 0
  }

  update() {
    if (this.y != this.prevY) {
      this.entity.depth = CHARACTERS_LAYER + (this.entity.y / this.scene.map.height)
      this.prevY = this.entity.y
    }
  }
}
