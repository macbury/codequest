import { playerUUID } from 'server/game/utils/uuid'
import { PlayerStatus } from 'shared/consts'

const START_STATE = {
  status: PlayerStatus.Setup.value,
  location: {
    map: 'fantasy_park/korytarz',
    col: 8,
    row: 7
  }
}

export default class PlayersRepository {
  constructor(db) {
    this.collection = db.collection('players')
  }

  nameExists(name) {
    return new Promise((resolve, reject) => {
      this.collection.find({ 'state.name': name }).count(function(err, playerCount) {
        if (err) {
          reject(err)
        } else {
          resolve(playerCount > 0)
        }
      })
    })
  }

  update(playerId, attributes) {
    this.collection.updateOne({ _id: playerId }, { '$set': attributes }, { upsert: true })
  }

  find(playerId) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ _id: playerId }, (err, player) => {
        if (err) {
          reject(err)
        } else {
          resolve(player)
        }
      })
    })
  }

  create(attributes) {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(attributes, function(err) {
        if (err != null) {
          reject(err)
        } else {
          resolve(attributes)
        }
      })
    })
  }

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ email }, (err, player) => {
        if (err) {
          reject(err)
        } else {
          resolve(player)
        }
      })
    })
  }

  findOrCreateBy({ email }) {
    return new Promise((resolve) => {
      this.findByEmail(email).then((player) => {
        if (player != null) {
          resolve(player)
        } else {
          this.create({
            _id: playerUUID(),
            email,
            state: { ...START_STATE }
          }).then(resolve)
        }
      })
    })
  }
}
