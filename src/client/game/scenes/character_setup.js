import BaseScene from './base'
import GameplayScene from './gameplay'
import { generateUiAnimation } from '../utils/animation'
import Entity from '../objects/entity'
import ItemsManager from '../managers/items_manager'
import EntityFactory from '../objects/entity_factory'
import TextField from '../ui/text_field'
import { Align, HALF_TILE_SIZE, TILE_SIZE } from '../../../shared/consts'
import MessageWindow from '../ui/message_window'
import { nameToBodyParts } from '../../../shared/characters'

/**
* Select character name, and build his gender and look based on name
*/
export default class CharacterSetupScene extends BaseScene {
  preload() {
    Entity.preload(this)
    ItemsManager.preload(this)
  }

  init() {
    this.entityFactory = new EntityFactory(this)
  }

  create() {
    super.create()
    this.items = new ItemsManager(this)
    generateUiAnimation(this, 'hand/hand-right')
    this.events.once('server:disconnect', this.onDisconnect.bind(this))
    this.events.once('server:boot', this.onBoot, this)
    this.events.on('server:setupError', this.onSetupError, this)
    this.fade.clear()
    this.mainMessage = this.add.bitmapText(0, 0, 'main', 'Wybierz imię dla swojego avatara!')
    this.secondMessage = this.add.bitmapText(0, 0, 'main', 'Na jego bazie powstanie wygląd postaci:')
    this.secondMessage.setOrigin(0.5, 0)
    this.mainMessage.setOrigin(0.5, 0)

    this.nameInput = new TextField(this)
    this.nameInput.value = ''
    this.nameInput.x = 10
    this.nameInput.width = 180

    this.nameInput.input.addEventListener('keypress', this.onNameChange.bind(this))
    this.nameInput.input.addEventListener('keyup', this.onNameChange.bind(this))
    this.nameInput.input.addEventListener('change', this.onNameChange.bind(this))

    this.add.existing(this.nameInput)
    this.logo = this.add.sprite(0,0,'logo').setOrigin(0.5,1)

    this.nameInput.focus()

    this.nextButton = this.add.sprite(0,0, 'ui', 'hand/hand-right')
    this.nextButton.play('hand/hand-right')
    this.nextButton.setOrigin(0.5, 0)
    this.nextButton.setInteractive()
    this.nextButton.on('pointerdown', this.onNextButtonClicked, this)

    this.statusWindow = new MessageWindow(this)
    this.add.existing(this.statusWindow)
    this.statusWindow.align = Align.Bottom

    this.playerPreviewEntity = this.entityFactory.create('preview:currentPlayer')
    this.onNameChange()
  }

  update() {
    let halfWidthInput = this.camera.width / 2
    this.nameInput.x = halfWidthInput - this.nameInput.width / 2
    this.nameInput.y = this.camera.height * 0.4 - this.nameInput.height / 2
    this.secondMessage.x = halfWidthInput
    this.secondMessage.y = this.nameInput.y - this.secondMessage.height - 14
    this.mainMessage.x = halfWidthInput
    this.mainMessage.y = this.secondMessage.y - this.mainMessage.height - 2
    this.logo.y = this.mainMessage.y - 10
    this.logo.x = halfWidthInput
    this.nextButton.x = halfWidthInput
    this.nextButton.y = this.camera.height - 50

    this.playerPreviewEntity.x = halfWidthInput - HALF_TILE_SIZE
    this.playerPreviewEntity.y = this.nameInput.y + TILE_SIZE + 40
  }

  onBoot(location) {
    this.fade.fadeOut(() => {
      let { map } = location
      let sceneKey = `map/${map}`
      this.scene.add(sceneKey, GameplayScene)
      this.scene.start(sceneKey, location)
      this.destroy()
    })
  }

  onNameChange() {
    let { body, equipment } = nameToBodyParts(this.nameInput.value)
    this.playerPreviewEntity.handleServerUpdate({ body, equipment })
  }

  onNextButtonClicked() {
    this.nextButton.visible = false
    this.nameInput.visible = false
    this.events.emit('client:changeName', this.nameInput.value)
  }

  onSetupError({ message }) {
    this.statusWindow.openAndShow(message).then(() => {
      this.statusWindow.close().then(() => {
        this.nextButton.visible = true
        this.nameInput.visible = true
      })
    })
  }

  onDisconnect() {
    this.goToScene('connection')
  }

  destroy() {
    this.nameInput.destroy()
    super.destroy()
  }
}
