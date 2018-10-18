import React from 'react'

import { AbstractNodeFactory } from 'storm-react-diagrams'
import LocationSelect from '../../../../ui/location_select'
import { TeleportNodeModel, TYPE } from '../models/teleport'
import { NodeWidgetWrapper } from './base'
import { Button, Label } from 'semantic-ui-react'
export { TeleportNodeModel }

export class TeleportNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(TYPE)
  }

  generateReactWidget(diagramEngine, node) {
    return <TeleportNodeWidget node={node} />
  }

  getNewInstance() {
    return new TeleportNodeModel()
  }
}

class TeleportNodeWidget extends React.Component {

  onClick(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    return false
  }

  onLocationSelect(location) {
    this.props.node.location = {...location}
    this.forceUpdate()
  }

  render() {
    let { node } = this.props
    let { col, row, map } = node.location
    return (
      <NodeWidgetWrapper title="Teleport" node={node}>
        <div className="node-padded">
          <LocationSelect
            value={node.location}
            onLocationSelect={this.onLocationSelect.bind(this)} />
        </div>
      </NodeWidgetWrapper>
    )
  }
}
