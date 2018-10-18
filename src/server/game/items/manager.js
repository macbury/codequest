import fs from 'fs'
import YAML from 'js-yaml'

import BaseItemsManager from 'shared/items/manager'
import { ITEMS_PATH } from 'server/paths'

const logger = require('server/game/logger').get('ItemsManager')

function loadData() {
  let text = fs.readFileSync(ITEMS_PATH).toString('utf8')
  let items = YAML.load(text)
  logger.debug(`Loaded ${items.length} items from ${ITEMS_PATH}`)
  return items
}

export default class ItemsManager extends BaseItemsManager {
  constructor() {
    let { idSeq, items } = loadData()
    super(items)
    this.idSeq = idSeq
  }

  nextId() {
    this.idSeq += 1
    return this.idSeq
  }

  save(item) {
    if (item.id == null) {
      item.id = this.nextId()
    }
    let found = false
    this.data = this.data.map((existingItem) => {
      if (existingItem.id == item.id) {
        found = true
        return item
      } else {
        return existingItem
      }
    })
    if (!found) {
      this.data.push(item)
    }
    this.reload(this.data)

    fs.writeFileSync(
      ITEMS_PATH,
      YAML.safeDump({
        idSeq: this.idSeq,
        items: this.data
      })
    )
    return item.id
  }
}
