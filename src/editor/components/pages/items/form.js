import React from 'react'
import { ItemType } from '../../../../shared/items/manager'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Prompt } from 'react-router-dom'

import { setCurrentItem, saveItem } from '../../../reducers/actions/items'
import { Button, Form, Divider } from 'semantic-ui-react'
import CharasSelect from '../../ui/charas_select'

const itemTypes = ItemType.enums.map(function(enumItem) {
  return {
    key: enumItem.key,
    text: enumItem.key,
    value: enumItem.key
  }
})


class ItemForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { modified: false }
  }

  componentWillReceiveProps(nextProps) {
    let nextItemId = nextProps.item.id
    if (nextItemId != this.props.item.id) {
      this.setState({ modified: false })
    }
  }

  onTextInputChange(name, ev) {
    this.setState({ modified: true })
    let { item } = this.props
    item[name] = ev.target.value
    this.props.setCurrentItem(item)
  }

  onSelectChange(name, ev, { value }) {
    this.setState({ modified: true })
    let { item } = this.props
    item[name] = value
    this.props.setCurrentItem(item)
  }

  onCharasChange({ value }) {
    this.setState({ modified: true })
    let { item } = this.props
    item['resource'] = value
    this.props.setCurrentItem(item)
  }

  onSubmit() {
    this.setState({ modified: false })
    this.props.saveItem(this.props.item)
  }

  render() {
    let { modified } = this.state
    let { item } = this.props
    let { name, description, type, resource } = item
    return (
      <Form onSubmit={this.onSubmit.bind(this)}>
        <Prompt when={modified} message={() => 'Unsaved changes will be lost. Are you sure?'} />
        <Form.Input fluid label='Name' placeholder='Name' value={name} onChange={this.onTextInputChange.bind(this, 'name')} />
        <Form.Input fluid label='Description' placeholder='Description' value={description} onChange={this.onTextInputChange.bind(this, 'description')} />
        <Form.Field>
          <label>Type</label>
          <Form.Select options={itemTypes} value={type} onChange={this.onSelectChange.bind(this, 'type')} />
        </Form.Field>
        <Form.Field>
          <label>Resource</label>
          <CharasSelect value={resource} onChange={this.onCharasChange.bind(this)} />
        </Form.Field>
        <Divider horizontal />
        <Button fluid primary type='submit'>Save</Button>
      </Form>
    )
  }
}

function mapActions(dispatch) {
  return bindActionCreators({ setCurrentItem, saveItem }, dispatch)
}

export default connect(null, mapActions)(ItemForm)
