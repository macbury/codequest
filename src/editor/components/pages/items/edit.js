import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import withItemsLoader from './items_provider'
import Wrapper from './wrapper'
import Form from './form'
import { Grid, Button } from 'semantic-ui-react'

import { setCurrentItemById, clearCurrentItem } from '../../../reducers/actions/items'

class EditItemPage extends React.Component {
  componentDidMount() {
    let nextItemId = this.props.match.params.itemId
    this.props.setCurrentItemById(nextItemId)
  }

  componentWillReceiveProps(nextProps) {
    let nextItemId = nextProps.match.params.itemId
    if (nextItemId != this.props.match.params.itemId) {
      this.props.setCurrentItemById(nextItemId)
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
  return bindActionCreators({ setCurrentItemById, clearCurrentItem }, dispatch)
}

export default withItemsLoader(withRouter(connect(mapStateToProps, mapActions)(EditItemPage)))
