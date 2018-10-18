import PlayersRepository from './players'
import SwitchesRepository from './switches'

export default function build(db) {
  return {
    players: new PlayersRepository(db),
    switches: new SwitchesRepository(db)
  }
}
