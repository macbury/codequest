require('dotenv').config()

import Passport from 'passport'
import { Strategy } from 'passport-google-oauth20'

const logger = require('server/game/logger').get('server')

export default function buildStrategy(app) {
  return new Promise((resolve) => {
    let { players } = app.get('repositories')
    Passport.serializeUser(function({ _id }, done) {
      done(null, _id)
    })

    Passport.deserializeUser(function(id, done) {
      players.find(id).then((user) => {
        if (user == null) {
          done('User not found', null)
        } else {
          done(null, user)
        }

      }).catch(done)
    })

    Passport.use(new Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, function(accessToken, refreshToken, profile, cb) {
      //logger.debug(JSON.stringify(profile))
      let { emails } = profile
      let email = emails[0].value
      players.findOrCreateBy({ email }).then((user) => {
        cb(null, user)
      }).catch((error) => {
        cb(error, null)
      })
    }))

    resolve()
  })
}
