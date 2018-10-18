const SYNC_EVERY = 5 * 60 * 1000
const logger = require('./logger').get('StatePersistance')

export default class StatePersistance {
  constructor(repositories, switches, players) {
    this.repositories = repositories
    this.switches = switches
    this.players = players
    setInterval(this.sync.bind(this), SYNC_EVERY)
  }

  sync() {
    Object.keys(this.players).forEach((playerId) => {
      this.syncPlayer(playerId)
    })
  }

  syncPlayer(playerId) {
    logger.debug(`Saving state: ${playerId}`)
    let player = this.players[playerId]
    let state = {...player.state.data}
    delete state['latency']
    delete state['speed']
    delete state['id']
    this.repositories.players.update(playerId, { state })
  }
}
