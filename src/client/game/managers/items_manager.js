import BaseItemsManager from '../../../shared/items/manager'

export default class ItemsManager extends BaseItemsManager {
  static preload(scene) {
    scene.load.json('itemsData', '/api/items.json')
  }

  constructor(scene) {
    super(scene.cache.json.get('itemsData'))
  }
}
