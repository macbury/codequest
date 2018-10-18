import { VarType } from './base'
import SetterModel from './setter'

export const TYPE = 'face'

export class FaceNodeModel extends SetterModel {
  constructor() {
    super(TYPE, VarType.Face)
  }
}
