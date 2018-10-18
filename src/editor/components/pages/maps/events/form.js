import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NodeEditor from './node_editor'
import { Grid, Menu, Icon, Segment, Form, Button, Divider, Checkbox } from 'semantic-ui-react'
import CharasSelect from '../../../ui/charas_select'
import { Direction, Trigger } from '../../../../../shared/consts'
import EnumSelect from '../../../ui/enum_select'
import { DiagramModel } from 'storm-react-diagrams'

import { updateEventName, updateEventState, updateEventAction } from '../../../../reducers/actions/maps'

class EventForm extends React.Component {
  get currentPage() {
    return this.props.event.pages[this.props.currentPage]
  }

  handleSubmit() {
    this.props.updateEventAction(this.model.serializeDiagram())
    this.props.onSubmit()
  }

  onTextInputChange(name, ev) {
    this.setState({ modified: true })
    this.props.updateEventName(ev.target.value)
  }

  onCharasChange({ value }) {
    this.setState({ modified: true })
    this.props.updateEventState({ charset: value })
  }

  onSelectChange(name, ev, { value }) {
    this.setState({ modified: true })
    let state = {}
    state[name] = value
    this.props.updateEventState(state)
  }

  onBlockingChange(ev, { checked }) {
    this.setState({ modified: true })
    this.props.updateEventState({ blocking: checked })
  }

  /**
  * Ugly hack, but fuck it...
  */
  handleNewModel(model) {
    this.model = model
  }

  render() {
    let { updateEventAction, onBack } = this.props
    let { name } = this.props.event
    let { state, action } = this.currentPage
    let { trigger, direction, charset, blocking } = state
    return (
      <Grid stretched padded celled>
        <Grid.Row>
          <Grid.Column width={1}>
            <Menu fluid vertical tabular>
              <Menu.Item name='1' active={true} onClick={() => { console.log("ADD") }} />
              <Menu.Item onClick={() => { console.log("ADD") }}>
                <Icon name='add' />
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={3}>
            <Segment>
              <Form>
                <Form.Input fluid label='Name' placeholder='Name' value={name} onChange={this.onTextInputChange.bind(this, 'name')} />
                <Form.Field>
                  <label>Charset</label>
                  <CharasSelect value={charset} onChange={this.onCharasChange.bind(this)} />
                </Form.Field>
                <Form.Field>
                  <label>Trigger</label>
                  <EnumSelect enumType={Trigger} value={trigger} onChange={this.onSelectChange.bind(this, 'trigger')}/>
                </Form.Field>
                <Form.Field>
                  <label>Direction</label>
                  <EnumSelect enumType={Direction} value={direction} onChange={this.onSelectChange.bind(this, 'direction')}/>
                </Form.Field>
                <Form.Field>
                  <Checkbox label='Blocking' checked={blocking} onChange={this.onBlockingChange.bind(this)} />
                </Form.Field>
              </Form>
            </Segment>
            <Segment basic>
              <Button primary fluid onClick={this.handleSubmit.bind(this)}>Save</Button>
              <Divider horizontal />
              <Button fluid onClick={onBack}>Back</Button>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12} stretched>
            <NodeEditor action={action}
              onGraphUpdate={updateEventAction}
              onModelReady={this.handleNewModel.bind(this)} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

function mapActions(dispatch) {
  return bindActionCreators({ updateEventName, updateEventState, updateEventAction }, dispatch)
}

export default connect(null, mapActions)(EventForm)
