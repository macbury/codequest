import { GetterPortModel, NodeModel } from './base'

export default class SetterModel extends NodeModel {
  constructor(type, varType) {
    super(type)
    this.addPort(new GetterPortModel('value', varType))
    this.value = ''
  }

  serialize() {
    let { value } = this
    return {...super.serialize(), payload: { value }}
  }

  deSerialize(object, engine) {
    super.deSerialize(object, engine)
    this.value = object.payload.value
  }
}
