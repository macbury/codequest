import { Router } from 'express'
const router = Router()

router.get('/', function(req, res) {
  let game = req.app.get('game')
  res.json(game.switches.data)
})

export default router
