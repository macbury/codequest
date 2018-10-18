import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import EventForm from './form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withEventsLoader } from '../provider'
import { withRouter } from 'react-router'
import { buildNewEvent, createEvent } from '../../../../reducers/actions/maps'

class NewEventPage extends React.Component {
  componentDidMount() {
    let { col, row } = this.props.match.params
    this.props.buildNewEvent({ col, row })
  }

  onBack() {
    let { name } = this.props.selected
    this.props.history.push(`/maps/${name}`)
  }

  onSubmit() {
    let { name } = this.props.selected
    this.props.createEvent(name, this.props.event)
    setTimeout(() => {
      this.props.history.replace(`/maps/${name}/events/${this.props.event.id}`)
    }, 400) //TODO fix this
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
                onBack={this.onBack.bind(this)}
                event={event}
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
  return bindActionCreators({ buildNewEvent, createEvent }, dispatch)
}

export default withRouter(withEventsLoader(connect(mapStateToProps, mapActions)(NewEventPage)))
