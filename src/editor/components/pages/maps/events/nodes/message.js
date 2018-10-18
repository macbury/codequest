import React from 'react'

import { AbstractNodeFactory } from 'storm-react-diagrams'
import { MessageNodeModel, TYPE } from '../models/message'
import { NodeWidgetWrapper } from './base'

export { MessageNodeModel }

export class MessageNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(TYPE)
  }

  generateReactWidget(diagramEngine, node) {
    return <MessageNodeWidget node={node} />
  }

  getNewInstance() {
    return new MessageNodeModel()
  }
}

class MessageNodeWidget extends React.Component {
  cancelPropagation(ev) {
    ev.stopPropagation()
  }

  onChange(ev) {
    this.props.node.content = ev.target.value
    this.forceUpdate()
  }

  render() {
    let { node } = this.props
    return (
      <NodeWidgetWrapper title="Show Message" node={node}>
        <textarea
          onMouseDown={this.cancelPropagation}
          onKeyUp={this.cancelPropagation}
          value={node.content}
          onChange={this.onChange.bind(this)} />
      </NodeWidgetWrapper>
    )
  }
}
