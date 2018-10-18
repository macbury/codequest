require('dotenv').config()
import { MongoClient } from 'mongodb'
import buildRepositories from '../repositories'

const { MONGODB_URI, MONGODB_DATABASE }  = process.env

export default function database(app) {
  let mongoClient = new MongoClient(MONGODB_URI, {
    auto_reconnect: true,
    reconnectTries: 10,
    reconnectInterval: 1000
  })
  return new Promise(function(resolve, reject) {
    console.log(`Connecting to: ${MONGODB_URI}`)
    mongoClient.connect((err, client) => {
      if (err) {
        console.error(`Could not connect to: ${MONGODB_URI}`)
        reject(err)
      } else {
        console.log('Connected to database!')
        let db = client.db(MONGODB_DATABASE)
        app.set('db', db)
        app.set('repositories', buildRepositories(db))
        resolve(db)
      }
    })
  })
}
