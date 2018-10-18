import { VarType } from './base'
import SetterModel from './setter'

export const TYPE = 'string'

export class StringNodeModel extends SetterModel {
  constructor() {
    super(TYPE, VarType.String)
  }
}
