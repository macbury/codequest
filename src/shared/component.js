export default class Component {
  constructor(entity) {
    this.entity = entity
  }

  init() {}

  update() {}

  dispose() {
    this.entity = null
  }
}
