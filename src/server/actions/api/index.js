import { Router } from 'express'
import userRequired from '../before_filter/user_required'
import developmentRequired from '../before_filter/development_required'

import { getItems, saveItem } from './items'
import { getMap, getMaps, getMapEvents, createMapEvent, updateMapEvent } from './map'

const router = Router()

router.post('/items', developmentRequired, saveItem)
router.get('/items.json', getItems)

router.get('/maps', developmentRequired, getMaps)
router.put('/maps/*/events/:id', developmentRequired, updateMapEvent)
router.post('/maps/*/events', developmentRequired, createMapEvent)
router.get('/maps/*/events', developmentRequired, getMapEvents)
router.get('/maps/*', getMap)

export default router
