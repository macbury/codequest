import Enum from 'enum'
import _ from 'underscore'

import { PortModel, DefaultLinkModel, AbstractPortFactory, NodeModel } from 'storm-react-diagrams'

export const VarType = new Enum([
  'String',
  'Face'
], { ignoreCase: true })

export { NodeModel } from 'storm-react-diagrams'

export class SetterPortModel extends PortModel {
  constructor(name, varType = VarType.String) {
    super(name, 'setter')
    this.varType = varType
  }

  canLinkToPort(getterPort) {
    let links = Object.values(this.links)
    if (getterPort instanceof GetterPortModel) {
      return links.length <= 1 && getterPort.varType == this.varType
    } else {
      return false
    }
  }

  deSerialize(object, engine) {
    let { name, varType } = object
    super.deSerialize(object, engine)
    this.name = name
    this.varType = VarType.get(varType)
  }

  serialize() {
    let { name, varType } = this
    return {...super.serialize(), name, varType: varType.key}
  }

  createLinkModel() {
    let links = Object.values(this.links)
    if (links.length == 1) {
      return links[0]
    } else if (links.length == 0){
      return new DefaultLinkModel()
    } else {
      return null
    }
  }
}

export class GetterPortModel extends PortModel {
  constructor(name, varType = VarType.String) {
    super(name, 'getter')
    this.varType = varType
  }

  canLinkToPort(setterPort) {
    if (setterPort instanceof SetterPortModel) {
      return setterPort.varType == this.varType
    } else {
      return false
    }
  }

  deSerialize(object, engine) {
    let { name, varType } = object
    super.deSerialize(object, engine)
    this.name = name
    this.varType = VarType.get(varType)
  }

  serialize() {
    let { name, varType } = this
    return {...super.serialize(), name, varType: varType.key}
  }

  createLinkModel() {
    return new DefaultLinkModel()
  }
}

// can have only one connection
export class OutputPortModel extends PortModel {
  constructor() {
    super('output', 'output')
  }

  canLinkToPort(port) {
    //console.log('OutputPortModel#canLinkToPort', port)
    if (port instanceof InputPortModel) {
      return true
    }
    return false
  }

  createLinkModel() {
    let links = Object.values(this.links)
    if (links.length == 1) {
      return links[0]
    } else if (links.length == 0){
      return new DefaultLinkModel()
    } else {
      return null
    }
  }
}

// can have multiple connections
export class InputPortModel extends PortModel {
  constructor() {
    super('input', 'input')
  }

  createLinkModel() {
    let links = Object.values(this.links)
    if (links.length == 1) {
      return links[0]
    } else if (links.length == 0){
      return new DefaultLinkModel()
    } else {
      return null
    }
  }

  canLinkToPort(port) {
    if (port instanceof OutputPortModel) {
      return Object.values(port.links).length <= 1
    }
    return false
  }
}

export class OutputPortFactory extends AbstractPortFactory {
  constructor() {
    super('output')
  }

  getNewInstance(initialConfig) {
    return new OutputPortModel(this.type)
  }
}

export class InputPortFactory extends AbstractPortFactory {
  constructor() {
    super('input')
  }

  getNewInstance(initialConfig) {
    return new InputPortModel(this.type)
  }
}

export class SetterPortFactory extends AbstractPortFactory {
  constructor() {
    super('setter')
  }

  getNewInstance(initialConfig) {
    return new SetterPortModel(this.type, this.name, this.varType)
  }
}

export class GetterPortFactory extends AbstractPortFactory {
  constructor() {
    super('getter')
  }

  getNewInstance(initialConfig) {
    return new GetterPortModel(this.type, this.name, this.varType)
  }
}

export class BaseEventModel extends NodeModel {

}
