require('dotenv').config()
import Session from 'express-session'

const { MONGODB_URI, MONGODB_DATABASE, SESSION_SECRET }  = process.env

const MongoDBStore = require('connect-mongodb-session')(Session)

const store = new MongoDBStore({
  uri: MONGODB_URI,
  databaseName: MONGODB_DATABASE,
  collection: 'sessions'
})

const session = Session({
  secret: SESSION_SECRET,
  resave: true,
  name: 'game.session',
  saveUninitialized: true,
  store
})

export default session
