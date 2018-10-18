/*
* A space map is a custom data struture, similar to a sparse 2D array. Entities are stored according to their coordinates;
* that is, two keys are needed to fetch entities, the x position and the y position. This allows fast look-up based on position.
*/
export default class EntityMap {
  constructor() {
    this.dirty = true
    this.data = {}
  }

  add({col, row}, entity) {
    if (this.data[col] == null) {
      this.data[col] = {}
    }

    if (this.data[col][row] == null) {
      this.data[col][row] = []
    }
    this.dirty = true
    this.data[col][row].push(entity)
  }

  isDirty() {
    return this.dirty
  }

  markAsClean() {
    this.dirty = false
  }

  forEach(callback) {
    Object.keys(this.data).forEach((col) => {
      Object.keys(this.data[col]).forEach((row) => {
        callback({ col: parseInt(col), row: parseInt(row) }, this.data[col][row])
      })
    })
  }

  delete({col, row}, entity) {
    if (this.data[col] == null || this.data[col][row] == null) return
    let idx = this.data[col][row].indexOf(entity)
    if (idx >= 0) this.data[col][row].splice( idx, 1 )
    this.dirty = true
  }

  get({col, row}) {
    if (this.data[col] == null) {
      return []
    }
    if (this.data[col][row] == null) {
      return []
    }
    return this.data[col][row]
  }

  /**
  * @return {Entity} first found entity
  */
  find({col, row, component}) {
    let entities = this.get({ col, row })
    if (entities == null) {
      return null
    }

    return entities.find((entity) => {
      return entity.components.have(component)
    })
  }

  getFirst(tile) {
    let objects = this.get(tile)
    return (objects ? objects[0] : null)
  }
}
