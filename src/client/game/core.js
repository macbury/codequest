import Phaser from 'phaser'

import SocketWrapper from './socket_wrapper'

export default class Core extends Phaser.Game {
  constructor(container, viewport) {
    super({
      type: Phaser.WEBGL,
      parent: container,
      width: viewport.width,
      height: viewport.height,
      pixelArt: true,
      autoResize: false,
      disableContextMenu: true,
      resolution: 1,
      zoom: 2,
      roundPixels: true,
      callbacks: {
        postBoot: () => this.create()
      }
    })
    this.container = container
    this.viewport = viewport
  }

  create() {
    window.addEventListener('resize', this.handleWindowResize.bind(this))
    this.handleWindowResize()
    this.socket = new SocketWrapper()
  }

  handleWindowResize() {
    let { worldWidth, worldHeight, viewportWidth, viewportHeight, marginTop } = this.viewport.update(
      window.innerWidth,
      window.innerHeight
    )
    //console.log(`aspectRatio: ${this.viewport.aspectRatio} ${this.viewport.width}x${this.viewport.height}`)
    this.resize(worldWidth, worldHeight)

    this.container.style.width = viewportWidth + 'px'
    this.container.style.height = viewportHeight + 'px'
    this.container.style.marginTop = marginTop + 'px'
  }
}
