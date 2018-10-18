import React from 'react'

import { AbstractNodeFactory, NodeModel } from 'storm-react-diagrams'
import { NodeWidgetWrapper, OutputPortModel } from './base'

import { TriggerNodeModel, TYPE } from '../models/trigger'

export { TriggerNodeModel }

class TriggerNodeWidget extends React.Component {
  render() {
    return <NodeWidgetWrapper title="Start" node={this.props.node} />
  }
}

export class TriggerNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(TYPE)
  }

  generateReactWidget(diagramEngine, node) {
    return <TriggerNodeWidget node={node} />;
  }

  getNewInstance() {
    return new TriggerNodeModel()
  }
}
