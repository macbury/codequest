import { Router } from 'express'
import Passport from 'passport'

const router = Router()

router.get('/login/', (req, res) => {
  res.render('login', {})
})

router.get('/auth/google/', Passport.authenticate('google', { scope: ['email'] }))

router.get('/auth/google/callback', Passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/')
})

router.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
});

export default router
