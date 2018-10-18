export default class TextInput extends Phaser.GameObjects.Group {
  constructor(scene) {
    super(scene)
    this.mainScene = scene
    this.container = scene.sys.game.container
    this.viewport = scene.sys.game.viewport
    this.input = document.createElement('input')
    this.input.className = 'text-input'
    this.container.appendChild(this.input)
    this.x = 0
    this.y = 0
    this.width = 100
    this.height = 10
    this.visible = true
  }

  preUpdate(time, delta) {
    if (this.visible) {
      this.input.style.display = 'block'
    } else {
      this.input.style.display = 'none'
    }
    this.input.style.top = this.y + 'px'
    this.input.style.left = this.x + 'px'
    this.input.style.width = this.width + 'px'
    this.input.style.height = this.height + 'px'
    this.input.style.zoom = Math.floor(this.viewport.scale)
    super.preUpdate(time, delta)
  }

  set value(newValue) {
    this.input.value = newValue
  }

  get value() {
    return this.input.value
  }

  focus() {
    this.input.focus()
  }

  get value() {
    return this.input.value
  }

  destroy() {
    console.log('Destroing input')
    this.input.remove()
    super.destroy()
  }
}
