import React from 'react'
import Wrapper from './wrapper'
import GameContainer from '../../ui/game_container'
import ContextMenu from '../../ui/context_menu'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Prompt } from 'react-router-dom'
import { Grid, Message, Menu } from 'semantic-ui-react'
import { withRouter } from 'react-router'
import { withMapsLoader, withEventsLoader } from './provider'

const CurrentMapEditor = withRouter(withEventsLoader((props) => {
  let { name, events } = props.selected
  return <GameContainer className="mapEditor" map={name} events={events} {...props} />
}))

const EditMapContextMenu = function ({ menuVisible, x, y, tile, history, mapName, selectedEvent }) {
  function onNewEvent() {
    let { col, row } = tile
    history.push(`/maps/${mapName}/events/new/${col},${row}`)
  }

  function onEditEvent() {
    let { id } = selectedEvent
    history.push(`/maps/${mapName}/events/${id}`)
  }

  function onDeleteEvent() {

  }

  if (selectedEvent) {
    return (
      <ContextMenu visible={menuVisible} x={x} y={y}>
        <Menu.Item name='Edit Event' onClick={onEditEvent}/>
        <Menu.Item name='Delete event' onClick={onDeleteEvent}/>
      </ContextMenu>
    )
  } else {
    return (
      <ContextMenu visible={menuVisible} x={x} y={y}>
        <Menu.Item name='New Event' onClick={onNewEvent}/>
      </ContextMenu>
    )
  }

}

class MapsEditPage extends React.Component {

  //<Prompt when={false} message={() => 'Are you sure?'} />
  render() {
    let { menuVisible, x, y, selectedEvent } = this.state || {}
    let { name } = this.props.selected || {}
    return (
      <Wrapper>
        <CurrentMapEditor
          selected={this.props.selected}
          onShowMenu={this.onShowMenu.bind(this)}
          onTileClick={this.onTileClick.bind(this)}
          onTileDoubleClick={this.onTileDoubleClick.bind(this)}>
          <EditMapContextMenu {...this.state}
            history={this.props.history}
            mapName={name}
            selectedEvent={selectedEvent}
            />
        </CurrentMapEditor>
      </Wrapper>
    )
  }

  onShowMenu(tile, pointer) {
    let { x, y } = pointer.event
    let { events } = this.props.selected
    let selectedEvent = Object.values(events).find(({ location }) => tile.col == location.col && tile.row == location.row)
    this.setState({ menuVisible: true, x: x + 8, y: y + 8, tile, selectedEvent })
  }

  onTileClick(tile, pointer) {
    this.setState({ menuVisible: false })
  }

  onTileDoubleClick({ col, row }, pointer) {
    this.setState({ menuVisible: false })
  }
}

function mapStateToProps({ maps }) {
  return { selected: maps.selected }
}

export default withMapsLoader(
  withRouter(
    connect(mapStateToProps)(MapsEditPage)
  )
)
