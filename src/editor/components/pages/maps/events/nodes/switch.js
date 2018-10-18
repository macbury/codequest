import React from 'react'

import { AbstractNodeFactory } from 'storm-react-diagrams'
import { SwitchNodeModel, TYPE } from '../models/switch'
import { NodeWidgetWrapper } from './base'
import { Checkbox, Input } from 'semantic-ui-react'
export { SwitchNodeModel }

export class SwitchNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(TYPE)
  }

  generateReactWidget(diagramEngine, node) {
    return <SwitchNodeWidget node={node} />
  }

  getNewInstance() {
    return new SwitchNodeModel()
  }
}

class SwitchNodeWidget extends React.Component {

  onChange(ev, { checked }) {
    ev.stopPropagation()
    this.props.node.targetState = checked
    this.forceUpdate()
  }

  render() {
    let { node } = this.props
    return (
      <NodeWidgetWrapper title="Change Switch" node={node}>
        <div className="node-padded">
          <Checkbox toggle checked={node.targetState} onChange={this.onChange.bind(this)} />
        </div>
      </NodeWidgetWrapper>
    )
  }
}
