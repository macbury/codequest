import Base from './base'
import { nameToBodyParts } from 'shared/characters'
import { PlayerStatus } from 'shared/consts'
const logger = require('../../logger').get('PlayerSetup')

function nameIsValid(name) {
  return name.length > 3 && name.match(/^[a-z0-9]+$/i)
}

/**
* This component is only added when player initial status is setup
* It allows player to generate name, avatar.
*/
export default class PlayerSetup extends Base {
  init() {
    logger.debug(`Initialized for: ${this.entity.id}`)
    this.localEvents.on('client:changeName', this.handleChangeName, this)
  }

  handleChangeName(newPlayerName) {
    if (!nameIsValid(newPlayerName)) {
      logger.error(`Name ${newPlayerName} is invalid! Use only letters and digits!`)
      this.localEvents.emit('remote:setupError', {
        type: 'validation',
        message: 'Nazwa musi mieć conajmniej 3 znaki takie jak litery i liczby'
      })
      return
    }

    this.repositories.players.nameExists(newPlayerName).then((nameTaken) => {
      if (nameTaken) {
        logger.error(`Name ${newPlayerName} is taken!`)
        this.localEvents.emit('remote:setupError', {
          type: 'validation',
          message: 'Nazwa jest już zajęta!'
        })
        return
      }

      let { body, equipment } = nameToBodyParts(newPlayerName)
      logger.info(`Player ${this.userId} wants his name to be ${newPlayerName}`)
      this.state.set('name', newPlayerName)
      this.state.set('body', body)
      this.state.set('equipment', equipment)
      this.state.setEnum('status', PlayerStatus.Exploring)
      this.entity.boot()
      this.server.statePersistance.syncPlayer(this.userId)
      this.remove()
    })
  }

  dispose() {
    this.localEvents.removeListener('client:changeName', this.handleChangeName, this)
    super.dispose()
  }
}
