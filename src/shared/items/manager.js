import Enum from 'enum'
import _ from 'underscore'

export const ItemType = new Enum([
  'Armor',
  'Quests',
  'Weapons',
  'Consumable'
], { ignoreCase: true })

class Item {
  constructor(data) {
    this.id = data.id
    this.data = data
  }

  get name() {
    return this.data.name
  }

  get description() {
    return this.data.description
  }

  get resource() {
    return this.data.resource
  }

  get type() {
    return ItemType.get(this.data.type)
  }
}

export default class ItemsManager {
  /**
  * @param [Array]
  */
  constructor(rawItems) {
    this.reload(rawItems)
  }

  reload(rawItems) {
    this.items = {}
    this.data = rawItems
  }

  get(itemId) {
    if (this.items[itemId] == null) {
      let item = this.data.find(({id}) => id == itemId)
      if (item != null) {
        this.items[itemId] = new Item(item)
      }
    }
    return this.items[itemId]
  }
}
