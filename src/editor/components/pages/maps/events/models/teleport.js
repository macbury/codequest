import { InputPortModel, BaseEventModel } from './base'
export const TYPE = 'teleport'

export class TeleportNodeModel extends BaseEventModel {
  constructor() {
    super(TYPE)
    this.location = {}
    this.addPort(new InputPortModel())
  }

  serialize() {
    let { location } = this
    return {...super.serialize(), payload: { location }}
  }

  deSerialize(object, engine) {
    super.deSerialize(object, engine)
    this.location = object.payload.location
  }
}
