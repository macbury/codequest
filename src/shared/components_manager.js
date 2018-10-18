export default class ComponentsManager {
  constructor(owner) {
    this.entity = owner
    this.data = []
  }

  addAll(componentTypes) {
    for (var i = 0; i < componentTypes.length; i++) {
      this.add(componentTypes[i])
    }
  }

  find(ComponentType) {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].constructor.name == ComponentType.name) {
        return this.data[i]
      }
    }

    return null
  }

  add(ComponentType, componentData) {
    //if (this.have(ComponentType)) {
    //  throw `Already have component of type ${ComponentType}`
    //}//TODO webpack mangle fuck this up...
    let component = new ComponentType(this.entity)
    this.data.push(component)
    component.init(componentData)
    return component
  }

  remove(component) {
    let index = this.data.indexOf(component)
    if (index > -1) {
      this.data.splice(index, 1)
      component.dispose()
    }
  }

  have(ComponentType) {
    if (typeof(ComponentType) == 'string') {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].constructor.name == ComponentType) {
          return true
        }
      }
    } else {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].constructor.name == ComponentType.name) {
          return true
        }
      }
    }

    return false
  }

  update() {
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].update()
    }
  }

  dispose() {
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].dispose()
    }
    this.data = []
  }
}
