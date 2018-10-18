import React from 'react'
import ContextMenu from '../../../ui/context_menu'
import { Menu, Input } from 'semantic-ui-react'
import { MessageNodeModel, MessageNodeFactory } from './nodes/message'
import { StringNodeModel, StringNodeFactory } from './nodes/string'
import { SwitchNodeModel, SwitchNodeFactory } from './nodes/switch'
import { TeleportNodeModel, TeleportNodeFactory } from './nodes/teleport'
import { FaceNodeModel, FaceNodeFactory } from './nodes/face'
import { OutputPortFactory, InputPortFactory, SetterPortFactory, GetterPortFactory } from './nodes/base'
import { TriggerNodeFactory } from './nodes/trigger'
import {
  DiagramWidget, DiagramModel, DiagramEngine, DefaultNodeModel
} from 'storm-react-diagrams'
import 'storm-react-diagrams/dist/style.min.css'

const EventCreationOptions = [
  { name: 'Show message', node: MessageNodeModel },
  { name: 'String Variable', node: StringNodeModel },
  { name: 'Face Variable', node: FaceNodeModel },
  { name: 'Teleport', node: TeleportNodeModel },
  { name: 'Change Switch', node: SwitchNodeModel }
]

const EventCreationMenu = ({ visible, x, y, diagramPoint, onClose, onAdd }) => {
  let options = EventCreationOptions.map(({ name, node }) => {
    function addNode() {
      let { x, y } = diagramPoint
      let newNode = new node()
      newNode.setPosition(x, y)
      onAdd(newNode)
      onClose()
    }
    return <Menu.Item name={name} onClick={addNode} key={name}/>
  })

  return (
    <ContextMenu visible={visible} x={x} y={y}>
      <Menu.Item>
        <Input icon='search' placeholder='Search event' />
      </Menu.Item>

      <Menu.Item name='Cancel' onClick={onClose}/>
      {options}
    </ContextMenu>
  )
}

export default class NodeEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { visible: false, x: 0, y: 0 }
    this.engine = new DiagramEngine()
    this.engine.installDefaultFactories()
    this.engine.registerNodeFactory(new MessageNodeFactory())
    this.engine.registerNodeFactory(new SwitchNodeFactory())
    this.engine.registerNodeFactory(new StringNodeFactory())
    this.engine.registerNodeFactory(new TeleportNodeFactory())
    this.engine.registerNodeFactory(new FaceNodeFactory())
    this.engine.registerNodeFactory(new TriggerNodeFactory())
    this.engine.registerPortFactory(new OutputPortFactory())
    this.engine.registerPortFactory(new InputPortFactory())
    this.engine.registerPortFactory(new SetterPortFactory())
    this.engine.registerPortFactory(new GetterPortFactory())
  }

  componentWillMount() {
    this.model = new DiagramModel()
    this.model.deSerializeDiagram(this.props.action, this.engine)
    this.engine.setDiagramModel(this.model)
    this.props.onModelReady(this.model)
  }

  componentDidMount() {
    this.contextDivEl.addEventListener('contextmenu', (e) => {
      e.stopPropagation()
      e.preventDefault()
      let diagramPoint = this.engine.getRelativeMousePoint(e)
      this.setState({ visible: true, x: e.clientX, y: e.clientY, diagramPoint })
      return false
    })
  }

  componentWillReceiveProps({ action }) {
    if (action !== this.props.action && action != null){
      this.model = new DiagramModel()
      this.model.deSerializeDiagram(action, this.engine)
      this.engine.setDiagramModel(this.model)
      this.props.onModelReady(this.model)
    }
  }

  onUpdate() {
    console.log(this.model.serializeDiagram())
    this.props.onGraphUpdate(this.model.serializeDiagram())
  }

  onAddNode(node) {
    this.model.addAll(node)
    this.onUpdate()
  }

  render() {
    return (
      <div className="diagramEditor" ref={el => this.contextDivEl = el} >
        <DiagramWidget
          diagramEngine={this.engine}
          allowLooseLinks={false}
          allowCanvasTranslation={true}
          smartRouting={false}
          actionStoppedFiring={this.onUpdate.bind(this)} />
        <EventCreationMenu {...this.state}
          model={this.model}
          onClose={() => { this.setState({ visible: false }) }}
          onAdd={this.onAddNode.bind(this)} />
      </div>
    )
  }
}
