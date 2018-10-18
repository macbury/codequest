import React from 'react'

import { AbstractNodeFactory } from 'storm-react-diagrams'
import FaceSelect from '../../../../ui/face_select'
import { FaceNodeModel, TYPE } from '../models/face'
import { NodeWidgetWrapper } from './base'

export { FaceNodeModel }

class FaceNodeWidget extends React.Component {
  cancelPropagation(ev) {
    ev.stopPropagation()
  }

  onChange(filename) {
    this.props.node.value = filename
    this.forceUpdate()
  }

  render() {
    let { node } = this.props
    return (
      <NodeWidgetWrapper title="Face" node={node}>
        <FaceSelect value={node.value} onFaceSelect={this.onChange.bind(this)}/>
      </NodeWidgetWrapper>
    )
  }
}

export class FaceNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(TYPE)
  }

  generateReactWidget(diagramEngine, node) {
    return <FaceNodeWidget node={node} />
  }

  getNewInstance() {
    return new FaceNodeModel()
  }
}
