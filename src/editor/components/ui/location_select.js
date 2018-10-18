import React from 'react'
import { Button, Header, Modal, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import MapsTree from './maps_tree'
import GameContainer from './game_container'
import { TILE_SIZE } from '../../../shared/consts'

const EMPTY_LOCATION = { map: null, col: null, row: null }

class LocationDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.location || {...EMPTY_LOCATION}
  }

  componentWillReceiveProps({ location, open }) {
    if (!open) {
      this.setState({...EMPTY_LOCATION})
    } else {
      this.setState(location || {...EMPTY_LOCATION})
    }
  }

  get events() {
    let { col, row } = this.state
    if (col == null || row == null) {
      return {}
    }

    return {
      'select:1': { x: col * TILE_SIZE, y: row * TILE_SIZE }
    }
  }

  onMapSelect(map) {
    this.setState({...EMPTY_LOCATION, map })
  }

  onLocationSelect({ col, row }) {
    let { map } = this.state
    this.setState({ map, col, row })
  }

  handleOk() {
    let { col, row } = this.state
    if (col == null || row == null) {
      this.props.onClose()
      return
    }

    this.props.onLocationSelect({...this.state})
    this.props.onClose()
  }

  get mapContainer() {
    let { map } = this.state
    if (map == null) {
      return <div />
    }
    return (
      <GameContainer
        className="mapEditor"
        events={this.events}
        map={map}
        onTileClick={this.onLocationSelect.bind(this)} />
    )
  }

  render() {
    let { open, onClose, onClear, maps } = this.props
    let { map } = this.state
    return (
      <Modal dimmer="blurring" size="fullscreen" open={open} onClose={onClose}>
        <Modal.Header>Select Location</Modal.Header>
        <Grid stretched padded>
          <Grid.Column width={3} style={{minHeight: '640px'}}>
            <MapsTree
              maps={maps}
              onMapSelect={this.onMapSelect.bind(this)}
              selected={{ name: map }} />
          </Grid.Column>
          <Grid.Column width={13}>{this.mapContainer}</Grid.Column>
        </Grid>
        <Modal.Actions>
          <Button onClick={onClear}>Clear</Button>
          <Button negative onClick={onClose}>Cancel</Button>
          <Button primary onClick={this.handleOk.bind(this)}>OK</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

function mapStateToProps({ maps }) {
  let { selected, all } = maps
  return {
    maps: all
  }
}

const ReduxedLocationDialog = connect(mapStateToProps)(LocationDialog)

export default class LocationSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  onClose() {
    this.setState({ open: false })
  }

  onOpen(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    this.setState({ open: true })
  }

  onClear() {
    this.props.onLocationSelect(null)
    this.onClose()
  }

  handleOptionSelect(filename) {
    this.onClose()
  }

  get label() {
    let { value } = this.props
    let { col, row, map } = value
    if (col == null) {
      return 'Select location'
    } else {
      return `${value.map} ${value.col}x${value.row}`
    }
  }

  render() {
    let { value, onLocationSelect } = this.props
    let { open } = this.state
    return (
      <div>
        <Button inverted size='tiny' onClick={this.onOpen.bind(this)}>{this.label}</Button>
        <ReduxedLocationDialog
          open={open}
          location={value}
          onLocationSelect={onLocationSelect}
          onClose={this.onClose.bind(this)}
          onClear={this.onClear.bind(this)} />
      </div>
    )
  }
}
