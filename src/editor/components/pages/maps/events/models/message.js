import { OutputPortModel, InputPortModel, BaseEventModel, SetterPortModel, VarType } from './base'
export const TYPE = 'message'

export class MessageNodeModel extends BaseEventModel {
  constructor() {
    super(TYPE)
    this.content = ''
    this.addPort(new InputPortModel())
    this.addPort(new SetterPortModel('face', VarType.Face))
    this.addPort(new SetterPortModel('name', VarType.String))
    this.addPort(new OutputPortModel())
  }

  serialize() {
    let { content } = this
    return {...super.serialize(), payload: { content }}
  }

  deSerialize(object, engine) {
    super.deSerialize(object, engine)
    this.content = object.payload.content
  }
}
