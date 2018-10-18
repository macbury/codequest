import Base from './base'

/**
* Show player or hide it using amazing tweens
*/
export default class PlayerSpawn extends Base {
  handleServerUpdate({ entered, leaved }) {
    if (entered) {
      this.fadeInPlayer()
    } else if (leaved) {
      this.fadeOutAndDestroy()
    }
  }

  fadeInPlayer() {
    this.entity.alpha = 0.0
    this.scene.tweens.add({
      targets: this.entity,
      duration: 300,
      alpha: 1.0
    })
  }

  fadeOutAndDestroy() {
    this.entity.alive = false
    this.scene.tweens.add({
      targets: this.entity,
      duration: 300,
      alpha: 0.0,
      onComplete: () => { this.entity.destroy() }
    })
  }
}
