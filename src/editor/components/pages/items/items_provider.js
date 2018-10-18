import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllItems } from '../../../reducers/actions/items'

const withItemsLoader = function (ComposedComponent) {
  let Component = class extends React.Component {
    componentDidMount() {
      if (this.props.items.all == null) {
        this.props.fetchAllItems()
      }
    }

    render() {
      if (this.props.items.all == null) {
        return (
          <Dimmer active inverted>
            <Loader />
          </Dimmer>
        )
      } else {
        return <ComposedComponent {...this.props}/>
      }
    }
  }

  function mapStateToProps({ items }) {
    return { items }
  }

  function mapActions(dispatch) {
    return bindActionCreators({ fetchAllItems }, dispatch)
  }

  return connect(mapStateToProps, mapActions)(Component)
}

export default withItemsLoader
