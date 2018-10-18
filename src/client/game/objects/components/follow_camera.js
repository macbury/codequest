import Base from './base'

/**
* Make camera follow this entity, and be in bounds of map
*/
export default class FollowCamera extends Base {

  update() {
    this.camera.scrollX = this.entity.x - this.camera.width * 0.5
    this.camera.scrollY = this.entity.y - this.camera.height * 0.5

    this.camera.scrollX = Math.max(this.camera.scrollX, 0)
    this.camera.scrollY = Math.max(this.camera.scrollY, 0)

    this.camera.scrollX = Math.min(
      this.camera.scrollX,
      this.map.width - this.camera.width
    )

    this.camera.scrollY = Math.min(
      this.camera.scrollY,
      this.map.height - this.camera.height
    )
  }

  get camera() {
    return this.scene.cameras.main
  }

  get map() {
    return this.scene.map
  }

  static get type() {
    return 'FollowCamera'
  }
}
