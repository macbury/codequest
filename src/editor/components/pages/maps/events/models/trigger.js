import { OutputPortModel, BaseEventModel } from './base'
export const TYPE = 'trigger'

export class TriggerNodeModel extends BaseEventModel {
  constructor() {
    super(TYPE)
    this.addPort(new OutputPortModel())
  }
}
