require('dotenv').config()

import express from 'express'
import emoji from 'node-emoji'
import logger from 'morgan'
import { Server } from 'http'
import bodyParser from 'body-parser'
import path from 'path'
import Passport from 'passport'

import GameServer from './game'
import session from './initializers/session'
import configurePassport from './initializers/passport'
import configureDatabase from './initializers/database'

import { DIST_DIR } from './paths'

import apiActions from './actions/api'
import editorActions from './actions/editor'
import handleDebugSwitches from './actions/debug/switches'
import homeActions from './actions/home'
import loginActions from './actions/login'
import handle404 from './actions/handle404'
import handle500 from './actions/handle500'

const app           = express(),
      httpServer    = Server(app),
      isDevelopment = process.env.NODE_ENV !== 'production',
      DEFAULT_PORT  = 3000

app.set('port', process.env.PORT || DEFAULT_PORT)
app.use(logger('dev'))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(session)
app.use(Passport.initialize())
app.use(Passport.session())

app.set('session', session)
app.set('httpServer', httpServer)
app.set('isDevelopment', isDevelopment)
app.set('view engine', 'pug')
app.use('/api', apiActions)
app.use('/', loginActions)
app.use('/', homeActions)

if (isDevelopment) {
  console.log('Using webpack dev server')
  app.set('views', path.join(__dirname, 'views'))
  app.set('app:javascript', 'http://localhost:9000/')
  app.use('/editor', editorActions)
} else {
  console.log(`Serving js from ${DIST_DIR}`)
  app.set('views', path.join(__dirname, '../../src/server/views'))
  app.set('app:javascript', '/')
  app.use(express.static(DIST_DIR))
}

app.use(handle404)
app.use(handle500)

configureDatabase(app).then(() => {
  configurePassport(app).then(() => {
    httpServer.listen(app.get('port'), function() {
      const game = new GameServer(app)
      app.set('game', game)
      console.log(emoji.emojify(':radioactive_sign:  Web listening on port: ' + app.get('port')))
    })
  })
})
