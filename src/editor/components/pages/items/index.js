import React from 'react'

import Wrapper from './wrapper'
import withItemsLoader from './items_provider'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { clearCurrentItem } from '../../../reducers/actions/items'

class ItemsPage extends React.Component {
  componentDidMount() {
    this.props.clearCurrentItem()
  }

  render() {
    return (
      <Wrapper>
      </Wrapper>
    )
  }
}

function mapActions(dispatch) {
  return bindActionCreators({ clearCurrentItem }, dispatch)
}

export default withItemsLoader(connect(null, mapActions)(ItemsPage))
