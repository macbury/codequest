import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllMaps, fetchEvents } from '../../../reducers/actions/maps'

export const withMapsLoader = function (ComposedComponent) {
  let Component = class extends React.Component {
    componentDidMount() {
      if (this.props.maps.all == null) {
        this.props.fetchAllMaps()
      }
    }

    render() {
      if (this.props.maps.all == null) {
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

  function mapStateToProps({ maps }) {
    return { maps }
  }

  function mapActions(dispatch) {
    return bindActionCreators({ fetchAllMaps }, dispatch)
  }

  return connect(mapStateToProps, mapActions)(Component)
}

export const withEventsLoader = function (ComposedComponent) {
  let Component = class extends React.Component {

    componentDidMount() {
      let nextMap = this.props.match.params[0]
      this.props.fetchEvents(nextMap)
    }

    componentWillReceiveProps(nextProps) {
      let nextMap = nextProps.match.params[0]
      if (nextMap != this.props.match.params[0]) {
        this.props.fetchEvents(nextMap)
      }
    }

    render() {
      if (this.props.maps.selected == null) {
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

  function mapStateToProps({ maps }) {
    return { maps }
  }

  function mapActions(dispatch) {
    return bindActionCreators({ fetchEvents }, dispatch)
  }

  return withMapsLoader(connect(mapStateToProps, mapActions)(Component))
}
