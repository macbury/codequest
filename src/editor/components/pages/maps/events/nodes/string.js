import React from 'react'

import { AbstractNodeFactory } from 'storm-react-diagrams'
import { StringNodeModel, TYPE } from '../models/string'
import { NodeWidgetWrapper } from './base'

export { StringNodeModel }

class StringNodeWidget extends React.Component {
  cancelPropagation(ev) {
    ev.stopPropagation()
  }

  onChange(ev) {
    this.props.node.value = ev.target.value
    this.forceUpdate()
  }

  render() {
    let { node } = this.props
    return (
      <NodeWidgetWrapper title="String variable" node={node}>
        <input type="text"
          onMouseDown={this.cancelPropagation}
          onKeyUp={this.cancelPropagation}
          value={node.value}
          onChange={this.onChange.bind(this)} />
      </NodeWidgetWrapper>
    )
  }
}

export class StringNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(TYPE)
  }

  generateReactWidget(diagramEngine, node) {
    return <StringNodeWidget node={node} />;
  }

  getNewInstance() {
    return new StringNodeModel()
  }
}
