import { OutputPortModel, InputPortModel, BaseEventModel, SetterPortModel, VarType } from './base'
export const TYPE = 'switch'

export class SwitchNodeModel extends BaseEventModel {
  constructor() {
    super(TYPE)
    this.targetState = false
    this.addPort(new InputPortModel())
    this.addPort(new SetterPortModel('name', VarType.String))
    this.addPort(new OutputPortModel())
  }

  serialize() {
    let { targetState } = this
    return {...super.serialize(), payload: { targetState }}
  }

  deSerialize(object, engine) {
    super.deSerialize(object, engine)
    this.targetState = object.payload.targetState
  }
}
