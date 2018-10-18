import Base from './base'

/**
* Update information in EntityMap about position of this entity
*/
export default class Cartographer extends Base {

  handleServerUpdate({ location }) {
    if (location != null) {
      this.entityMap.delete(this.entity.tile, this.entity)
      this.entityMap.add(location, this.entity)
    }
  }
}
