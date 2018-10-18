import BaseScene from '../base'

/**
* Test charset assembly
*/
export default class CharsetScene extends BaseScene {
  preload() {
    this.load.atlas(
      'charasAtlas',
      '/assets/graphics/characters/charas.png',
      '/assets/graphics/characters/charas.json'
    )
  }

  create() {
    let direction = 'up'
    let armorId = Math.round(Math.random() * 26)
    let headId = Math.round(Math.random() * 20)
    let hairId = Math.round(Math.random() * 6)
    let hatId = Math.round(Math.random() * 7)
    this.createSprite(`male/body/0/${direction}`)
    this.createSprite(`shared/armor/${armorId}/${direction}`)

    this.createSprite(`shared/head/${headId}/${direction}`)

    if (Math.random() > 0.5) {
      this.createSprite(`shared/hat/${hatId}/${direction}`)
    } else {
      this.createSprite(`male/hair/${hairId}/${direction}`)
    }
  }

  createSprite(animationName) {
    let frames = this.anims.generateFrameNames('charasAtlas', {
      prefix: animationName,
      suffix: '.png',
      frames: [1, 0, 1, 2]
    })

    this.anims.create({
      key: animationName,
      frames,
      repeat: -1,
      frameRate: 5
    })

    let body = this.add.sprite(0, 0, 'charasAtlas')
    body.setOrigin(0.5, 0.5)
    body.x = 8 + 16
    body.y = 16
    body.play(animationName)
    //body.anims.stop()
  }
}
