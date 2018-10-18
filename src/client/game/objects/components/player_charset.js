import Base from './base'
import { getTileDirection } from '../../../../shared/tile'
import { Direction } from '../../../../shared/consts'
import { generateCharsetAnimation } from '../../utils/animation'

const Directions = [
  Direction.Down,
  Direction.Up,
  Direction.Left,
  Direction.Right
]

class CharsetPart {
  constructor(sprite) {
    this.sprite = sprite
    this.id = null
    this.directions = {}
    this.sprite.visible = false
  }

  keyForDirection(direction) {
    return `${this.id}/${direction.key.toLowerCase()}`
  }

  generateAnims() {
    if (this.id == null) {
      return
    }

    for (var i = 0; i < Directions.length; i++) {
      let direction = Directions[i]
      this.directions[direction] = generateCharsetAnimation(this.sprite.scene, this.keyForDirection(direction))
    }
  }

  get isPlaying() {
    return this.anims.isPlaying
  }

  set x(nx) {
    this.sprite.x = nx
  }

  get x() {
    return this.sprite.x
  }

  set y(ny) {
    this.sprite.y = ny
  }

  get y() {
    return this.sprite.y
  }

  set depth(ndepth) {
    this.sprite.depth = ndepth
  }

  get depth() {
    return this.sprite.depth
  }

  get visible() {
    return this.sprite.visible
  }

  changeId(id) {
    let playing = this.isPlaying
    if (this.id === id) {
      return
    }

    this.id = id

    this.sprite.visible = this.id != null

    if (!this.visible) {
      return
    }

    if (this.direction == null) {
      this.direction = Direction.Down
    }

    this.generateAnims()

    this.play(this.direction)
    if (!playing) {
      this.stop()
    }
  }

  get anims() {
    return this.sprite.anims
  }

  /**
  * @param {Direction} direction to play
  */
  play(direction) {
    this.direction = direction
    if (this.directions[direction] == null) {
      this.anims.stop()
    } else {
      this.sprite.play(this.directions[direction])
    }
  }

  clear() {
    this.stop()
    this.sprite.visible = false
    this.id = null
    // clear current animation
  }

  stop() {
    if (this.anims.currentAnim != null) {
      this.anims.restart()
      this.anims.stop()
    }
  }

  dispose() {
    this.sprite.destroy()
  }
}

/**
* Handles loading player charset
*/
export default class PlayerCharset extends Base {
  handleServerUpdate({ body, equipment }) {
    if (body != null) {
      let { head, hair, male } = body
      this.head.changeId(`dynamic/shared/head/${head}`)

      if (male) {
        this.hair.changeId(`dynamic/male/hair/${hair}`)
        this.shorts.changeId('dynamic/male/shorts/0')
      } else {
        try {
          this.hair.changeId(`dynamic/female/hair/${hair}`)
        } catch(e) {
          console.error(`undefined hair id: ${hair}`)
          console.error(e)
        }
        this.shorts.changeId('dynamic/female/shorts/0')
      }
    }

    if (equipment != null) {
      let { armor } = equipment
      let item = this.items.get(armor)
      if (item) {
        this.armor.changeId(item.resource)
      } else {
        this.armor.changeId(null)
      }
    } else {
      this.armor.changeId(null)
    }
  }

  init() {
    this.prevDirection = null
    this.state.direction = Direction.Down.key

    this.localEvents.on('movement:begin', this.playAnimation, this)
    this.localEvents.on('charset:play', this.playAnimation, this)
    this.localEvents.on('movement:waypoint', this.calculateOrientation, this)
    this.localEvents.on('movement:finished', this.stopAnimation, this)

    this.body = new CharsetPart(this.createSprite())
    this.shorts = new CharsetPart(this.createSprite())
    this.armor = new CharsetPart(this.createSprite())
    this.head = new CharsetPart(this.createSprite())
    this.hair = new CharsetPart(this.createSprite())

    this.body.changeId('dynamic/male/body/0')
    this.armor.changeId(null)
    this.shorts.changeId('dynamic/male/shorts/0')
    this.hair.changeId('dynamic/male/hair/0')

    this.playAnimation()
    this.stopAnimation()
  }

  calculateOrientation({origin, target}) {
    let nextDirection = getTileDirection(origin, target).key
    if (nextDirection != null) {
      this.state.direction = nextDirection
    }
  }

  update() {
    if (this.prevDirection != this.state.direction) {
      this.playAnimation()
      if (!this.state.movement) {
        this.stopAnimation()
      }
      this.prevDirection = this.state.direction
    }
    //this.armor.x = this.hair.x = this.body.x = this.head.x = this.shorts.x = this.entity.x
    //this.armor.y = this.hair.y = this.body.y = this.head.y = this.shorts.y = this.entity.y
    //this.armor.depth = this.hair.depth = this.body.depth = this.head.depth = this.shorts.depth = this.entity.depth
  }

  get direction() {
    return Direction.get(this.state.direction || 'Down')
  }

  playAnimation() {
    this.body.play(this.direction)
    this.head.play(this.direction)
    this.hair.play(this.direction)
    this.shorts.play(this.direction)
    this.armor.play(this.direction)
  }

  stopAnimation() {
    this.shorts.stop()
    this.armor.stop()
    this.body.stop()
    this.head.stop()
    this.hair.stop()
  }

  dispose() {
    this.localEvents.removeListener('movement:waypoint', this.calculateOrientation)
    this.localEvents.removeListener('movement:finished', this.stopAnimation)
    this.localEvents.removeListener('movement:begin', this.playAnimation)
    this.localEvents.removeListener('charset:play', this.playAnimation)
    this.body.dispose()
    this.head.dispose()
    this.hair.dispose()
    this.armor.dispose()
    this.shorts.dispose()
    super.dispose()
  }
}
