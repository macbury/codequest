import React from 'react'
import _ from 'underscore'
import { PortWidget } from 'storm-react-diagrams'
import {
  InputPortModel,
  OutputPortModel,
  SetterPortModel,
  GetterPortModel,
  OutputPortFactory,
  InputPortFactory,
  SetterPortFactory,
  GetterPortFactory
} from '../models/base'

export {
  InputPortModel,
  OutputPortModel,
  SetterPortModel,
  GetterPortModel,
  OutputPortFactory,
  InputPortFactory,
  SetterPortFactory,
  GetterPortFactory
}

const LeftPorts = function ({ node, ports }) {
  let portsElms = ports.map((port) => {
    return (
      <div className="node-port" key={port.id}>
        <PortWidget name={port.name} node={node} />
        <span>{port.name}</span>
      </div>
    )
  })

  return (
    <div className="node-left">
      { portsElms }
    </div>
  )
}

const RightPorts = function ({ node, ports }) {
  if (ports.length == 0) {
    return <div style={{ display: 'none' }} />
  }

  let portsElms = ports.map((port) => {
    return (
      <div className="node-port" key={port.id}>
        <span>{port.name}</span>
        <PortWidget name={port.name} node={node} />
      </div>
    )
  })

  return (
    <div className="node-right">
      { portsElms }
    </div>
  )
}

export class NodeWidgetWrapper extends React.Component {

  get inputPorts() {
    return _.filter(this.props.node.ports, (port) => {
      return (port instanceof InputPortModel) || (port instanceof SetterPortModel)
    })
  }

  get outputPorts() {
    return _.filter(this.props.node.ports, (port) => {
      return (port instanceof OutputPortModel) || (port instanceof GetterPortModel)
    })
  }

  get innerClass() {
    let base = ['node-inner']
    if (this.inputPorts.length > 0) {
      base.push('node-with-inputs')
    }

    if (this.outputPorts.length > 0) {
      base.push('node-with-outputs')
    }
    return base.join(' ')
  }

  render() {
    let { title, children, node } = this.props
    return (
      <div className={`srd-default-node node-action node-${node.type}`}>
        <div className="srd-default-node__title">
          <div className="srd-default-node__name">{ title }</div>
        </div>

        <LeftPorts node={node} ports={this.inputPorts} />
        <RightPorts node={node} ports={this.outputPorts} />

        <div className={this.innerClass}>
          { children }
        </div>
        <div style={{clear: 'both'}}></div>
      </div>
    )
  }
}
