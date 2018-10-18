import { Router } from 'express'
const router = Router()

router.get('/', function(req, res, next) {
  res.render('editor', {
    app_javascript: req.app.get('app:javascript')
  })
});

export default router
