import Window from './window'
import { LAYER_UI_MESSAGES, MESSAGE_WIDTH, MESSAGE_HEIGHT } from '../rendering'
import _ from 'underscore'

const SPACE = '  '
const LETTER_SIZE = 6
const TEXT_PADDING = 10
const LINE_HEIGHT = 12

function wordWrapLine(line, width) {
  let words = line.split(SPACE)
  let lines = []
  let l = []
  while(words.length > 0) {
    let word = words.shift()
    l.push(word)
    let text = l.join(SPACE)
    let textWidth = text.length * LETTER_SIZE
    if (text.length * LETTER_SIZE >= width) {
      words.splice(0, 0, word)
      l.pop()
      lines.push(l.join(SPACE))
      l = []
    } else if (text.length * LETTER_SIZE > width) {
      l = []
      lines.push(text)
    }
  }

  if (l.length > 0) {
    lines.push(l.join(SPACE))
  }

  return lines
}

function wordWrapText(text, width) {
  let lines = text.replace(/ /ig, SPACE).split("\n")
  return _.flatten(lines.map((line) => wordWrapLine(line, width)))
}

function wordWrapPagesText(text, width, height) {
  let lines = wordWrapText(text, width)
  let linesPerPage = Math.floor(height / LINE_HEIGHT)
  let pageCount = Math.ceil(lines.length / linesPerPage)
  let pages = []
  for (var i = 0; i < pageCount; i++) {
    let from = i*linesPerPage
    pages.push(lines.slice(from, from + linesPerPage).join("\n"))
  }
  return pages
}

export default class MessageWindow extends Window {
  constructor(scene, width = MESSAGE_WIDTH, height = MESSAGE_HEIGHT) {
    super(scene, width, height)

    this.face = this.create(0, 0)
    this.face.depth = LAYER_UI_MESSAGES
    this.face.setOrigin(0,0)
    this.add(this.face)
    this.face.visible = false

    this.labelShadow = this.scene.add.dynamicBitmapText(0, 0, 'main', '')
    this.labelShadow.depth = LAYER_UI_MESSAGES + 1
    this.labelShadow.tint = 0x000000
    this.labelShadow.alpha = 0.6
    this.add(this.labelShadow)

    this.labelText = this.scene.add.dynamicBitmapText(0, 0, 'main', '')
    this.labelText.depth = LAYER_UI_MESSAGES + 2
    this.labelText.tint = 0xccd5ff
    this.add(this.labelText)

    this.shadow = this.scene.add.dynamicBitmapText(0, 0, 'main', '')
    this.shadow.depth = LAYER_UI_MESSAGES + 1
    this.shadow.tint = 0x000000
    this.shadow.alpha = 0.6
    this.add(this.shadow)

    this.text = this.scene.add.dynamicBitmapText(0, 0, 'main', '')
    this.text.depth = LAYER_UI_MESSAGES + 2
    this.add(this.text)

    this.nextMessage = this.create(0, 0, 'ui', 'window/message-next.png')
    this.nextMessage.depth = LAYER_UI_MESSAGES
    this.nextMessage.setOrigin(0,0)
    this.add(this.nextMessage)

    this.nextMessage.visible = false
    Phaser.Actions.SetAlpha(this.children.entries, 0.0)
  }

  clear() {
    this.labelShadow.setText('')
    this.labelText.setText('')
    this.text.setText('')
    this.shadow.setText('')
  }

  close() {
    return new Promise((resolve) => {
      super.close().then(() => {
        this.face.visible = false
        this.labelText.visible = false
        this.labelShadow.visible = false
        this.label = null
        this.nextMessage.visible = false
        this.clear()
        resolve()
      })
    })
  }

  openAndShow(text, label = null, faceset = null) {
    return new Promise((resolve) => {
      this.open().then(() => {
        this.showText(text).then(resolve)
      })
    })
  }

  showPage(text) {
    this.textContent = text
    let totalDuration = this.speed * text.length
    return new Promise((resolve) => {
      this.text.setText('')
      this.shadow.setText('')
      this.textTween = this.scene.tweens.addCounter({
        from: 0,
        to: text.length - 1,
        duration: totalDuration,
        onComplete: this.waitForInput.bind(this, resolve)
      })
    })
  }

  async showText(text, label = null, faceset = null) {
    this.speed = 25
    if (label) {
      this.labelShadow.setText(`[${label}]`)
      this.labelText.setText(`[${label}]`)
      this.labelShadow.visible = this.labelText.visible = true
    } else {
      this.labelShadow.visible = this.labelText.visible = false
    }
    if (faceset) {
      this.face.setTexture('facesetsAtlas', faceset)
      this.face.visible = true
    } else {
      this.face.visible = false
    }

    let width = this.width
    if (this.face.visible) {
      width -= this.face.width
      width -= TEXT_PADDING
    }
    width -= TEXT_PADDING * 2

    let height = this.height - TEXT_PADDING * 2
    if (this.labelText.visible) {
      height -= this.labelText.height
    }

    let pages = wordWrapPagesText(
      text,
      width,
      height
    )

    for (let i = 0; i < pages.length; i++) {
      let page = pages[i]
      await this.showPage(pages[i])
    }

    return true
  }

  waitForInput(resolve) {
    this.nextMessage.visible = true
    this.textTween = null
    this.text.setText(this.textContent)
    this.shadow.setText(this.textContent)
    this.scene.input.once('pointerdown', () => {
      this.nextMessage.visible = false
      resolve()
    })
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (this.visible) {
      this.face.x = this.x + TEXT_PADDING
      this.face.y = this.y + TEXT_PADDING

      if (this.face.visible) {
        this.text.x = this.face.x + this.face.width + TEXT_PADDING
      } else {
        this.text.x = this.x + TEXT_PADDING
      }

      if (this.labelText.visible) {
        this.labelText.y = this.y + TEXT_PADDING - 2
        this.text.y = this.labelText.y + this.labelText.height + 4
      } else {
        this.text.y = this.y + TEXT_PADDING
      }

      this.labelText.x = this.text.x

      this.shadow.x = this.text.x + 1
      this.shadow.y = this.text.y + 1
      this.labelShadow.x = this.labelText.x + 1
      this.labelShadow.y = this.labelText.y + 1

      if (this.textTween != null) {
        let output = this.textContent.slice(0, Math.round(this.textTween.getValue()))
        this.text.setText(output)
        this.shadow.setText(output)
      }

      this.nextMessage.x = this.x + this.width - 16
      this.nextMessage.y = this.y + this.height - 10 + Math.sin(time * 0.01)
    }
    this.shadow.visible = this.text.visible = this.visible
  }
}
