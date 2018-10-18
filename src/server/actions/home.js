import { Router } from 'express'
import userRequired from './before_filter/user_required'
const router = Router()

router.get('/', userRequired, function(req, res, next) {
  res.render('index', {
    app_javascript: req.app.get('app:javascript')
  })
});

export default router
