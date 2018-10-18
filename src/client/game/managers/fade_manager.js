/**
* Handle fading in and out in scene. On fade out emit event.
* Standard fade in after player receives information about its location
*/
export default class FadeManager {
  constructor(scene) {
    this.scene = scene
    this.camera.resetFX()
    this.camera.fadeIn(0, 0, 0, 0)
    scene.events.on('currentPlayerSpawned', this.fadeIn, this)
  }

  /**
  * Main game camera
  * @return {Phaser.Cameras.Scene2D.Camera}
  */
  get camera() {
    return this.scene.cameras.main
  }

  clear() {
    this.camera.resetFX()
  }

  fadeIn(callback = () => {}) {
    this.clear()
    this.camera.once('camerafadeincomplete', callback)
    this.camera.fadeIn(300, 0, 0, 0)
  }

  fadeOut(callback) {
    this.camera.once('camerafadeoutcomplete', () => {
      /*
      * fade out callback is done inside update loop and it breaks removing scenes
      * run it in next tick of reactor
      */
      setTimeout(callback, 0)
    })
    this.camera.fadeOut(300, 0, 0, 0)
  }
}
