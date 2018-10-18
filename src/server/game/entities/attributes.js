export default class Attributes {
  constructor(data) {
    this.data = data
    this.dirty = !this.isEmpty()
  }

  getEnum(key, EnumType, defaultVal) {
    if (this.isPresent(key)) {
      return EnumType.get(this.get(key))
    }
    return defaultVal
  }

  setEnum(key, enumVal) {
    this.set(key, enumVal.value)
  }

  get(key, defaultValue) {
    return this.data[key] || defaultValue
  }

  set(key, value, quiet) {
    if (value == null) {
      throw `Use remove to clear value for ${key}`
    }
    this.data[key] = value
    if (!this.dirty) {
      this.dirty = !quiet
    }
  }

  updateAll(newState) {
    this.data = newState
    this.dirty = true
  }

  isEqual(key, value) {
    return this.get(key) == value
  }

  getUpdatePacket() {
    return {...this.data}
  }

  remove(key, quiet) {
    delete this.data[key]
    if (!this.dirty) {
      this.dirty = !quiet
    }
  }

  isNull(key) {
    return this.data[key] == null
  }

  isPresent(key) {
    return !this.isNull(key)
  }

  isEmpty() {
    return Object.keys(this.data).length == 0
  }

  isDirty() {
    return this.dirty
  }

  markAsDirty() {
    this.dirty = true
  }

  markAsClean() {
    this.dirty = false
  }
}
