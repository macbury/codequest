import _ from 'underscore'
import React from 'react'
import { withRouter } from 'react-router'
import CharasIcon from '../../ui/charas_icon'
import { List, Image } from 'semantic-ui-react'

class ItemList extends React.Component {

  onClick(id, ev) {
    let { history } = this.props
    history.push(`/items/${id}`)
  }

  get selectedItemId() {
    let { match } = this.props
    return match ? match.params.itemId : null
  }

  isSelected(itemId) {
    return this.selectedItemId == itemId
  }

  getItems() {
    let { items, history } = this.props
    return _.map(items.all, ({ type, resource, name, id }) => {
      return (
        <List.Item active={this.isSelected(id)} key={`item_${id}`} onClick={this.onClick.bind(this, id)}>
          <div className="itemListPreview">
            <CharasIcon name={`${resource}/down1`} />
          </div>
          <List.Content>
            <List.Header as='a'>{name}</List.Header>
            <List.Description as='a'>{type}</List.Description>
          </List.Content>
        </List.Item>
      )
    })
  }

  render() {
    let { items } = this.props
    return (
      <List selection verticalAlign='middle'>{this.getItems()}</List>
    )
  }
}

export default withRouter(ItemList)
