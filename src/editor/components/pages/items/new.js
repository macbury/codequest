import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import withItemsLoader from './items_provider'
import Wrapper from './wrapper'
import Form from './form'
import { Grid, Button } from 'semantic-ui-react'

import { buildNewItem } from '../../../reducers/actions/items'

class NewItemPage extends React.Component {
  componentDidMount() {
    this.props.buildNewItem()
  }

  componentWillReceiveProps(nextProps) {
    let nextItemId = nextProps.items.selected.id
    if (nextItemId != null) {
      this.props.history.push(`/items/${nextItemId}`)
    }
  }

  render() {
    let { items } = this.props
    let { selected } = items
    return (
      <Wrapper>
        { selected ? <Form item={selected} /> : <div>Not found</div> }
      </Wrapper>
    )
  }
}

function mapStateToProps({ items }) {
  return { items }
}

function mapActions(dispatch) {
  return bindActionCreators({ buildNewItem }, dispatch)
}

export default withItemsLoader(withRouter(connect(mapStateToProps, mapActions)(NewItemPage)))
