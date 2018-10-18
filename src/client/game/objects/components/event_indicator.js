import Base from './base'
import { SELECTION_LAYER } from '../../rendering'

export default class EventIndicator extends Base {
  init() {
    this.indicator = this.scene.add.sprite(0, 0, 'ui', 'target/event.png')
    this.indicator.setOrigin(0.5, 0)
    this.indicator.setTint(0xffffff)
    this.indicator.alpha = 0.5
    this.entity.add(this.indicator)
    this.enabled = true
  }

  dispose() {
    this.indicator.destroy()
    this.indicator = null
  }
}
