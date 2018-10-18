import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import EventForm from './form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withEventsLoader } from '../provider'
import { withRouter } from 'react-router'
import { selectEventById, updateEvent } from '../../../../reducers/actions/maps'

class EditEventPage extends React.Component {
  componentDidMount() {
    let mapName = this.props.match.params[0]
    let eventId = this.props.match.params.id
    this.props.selectEventById(eventId)
  }

  onBack() {
    let { name } = this.props.selected
    this.props.history.push(`/maps/${name}`)
  }

  onSubmit() {
    let { name } = this.props.selected
    this.props.updateEvent(name, this.props.event)
  }

  render() {
    let { event, currentPage, selected } = this.props
    if (event == null) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    } else {
      return <EventForm
                event={event}
                onBack={this.onBack.bind(this)}
                currentPage={currentPage}
                onSubmit={this.onSubmit.bind(this)} />
    }
  }
}

function mapStateToProps({ maps }) {
  let { event, currentPage, selected } = maps
  return { event, currentPage, selected }
}

function mapActions(dispatch) {
  return bindActionCreators({ selectEventById, updateEvent }, dispatch)
}

export default withRouter(withEventsLoader(connect(mapStateToProps, mapActions)(EditEventPage)))
