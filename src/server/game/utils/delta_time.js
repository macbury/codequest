export default class DeltaTime {
  constructor() {
    this.lastUpdate = Date.now()
    this.delta = 0
  }

  /**
  * Calculate delta
  */
  update() {
    let currentDate = Date.now()
    this.delta = currentDate - this.lastUpdate
    this.lastUpdate = currentDate
  }

  /**
  * Current delta as integer in miliseconds
  */
  get() {
    return this.delta
  }
}
