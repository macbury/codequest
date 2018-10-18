import _ from 'underscore'
import React from 'react'
import { Button, Header, Modal, Grid } from 'semantic-ui-react'

import CharasIcon from './charas_icon'
import charasAtlasContent from '../../../assets/characters/charas.json?load-inline'

const COLUMNS = 8
const FRAME = '/down1'

function extractFrames(query, { frames }) {
  return frames.filter((item) => {
    return item.filename.match(query)
  }).map(({ filename, frame }) => {
    let value = filename.replace(FRAME, '')
    return {
      label: value,
      value: value,
      frame
    }
  })
}


export default class CharasSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.items = _.chunk(extractFrames(/(static|shared\/hat|shared\/armor)\/.+\/down1/i, charasAtlasContent), COLUMNS)
  }

  close() {
    this.setState({ open: false })
  }

  clear() {
    this.onOptionSelect(null)
  }

  onOptionSelect(value) {
    this.close()
    this.props.onChange({ value })
  }

  open(ev) {
    ev.preventDefault()
    this.setState({ open: true })
  }

  get value() {
    return (this.props.value || '') + FRAME
  }

  get rows() {
    return this.items.map((row, index) => {
      return (
        <Grid.Row key={ index } className="charas-select">
          { this.renderOptions(row) }
        </Grid.Row>
      )
    })
  }

  renderOptions(options) {
    return options.map(({ value }) => {
      let selected = this.props.value == value
      return (
        <div value={value} className={selected ? 'charas-option charas-option-selected' : 'charas-option'} key={value} onClick={this.onOptionSelect.bind(this, value)}>
          <CharasIcon name={value+FRAME} />
        </div>
      )
    })
  }

  render() {
    let { open } = this.state
    return (
      <div className="charas-select">
        <div onClick={this.open.bind(this)} className="current-charas-button">
          <CharasIcon name={this.value} />
        </div>
        <Modal dimmer="blurring" size="fullscreen" open={open} onClose={this.close.bind(this)}>
          <Modal.Header>
            Find charset
          </Modal.Header>
          <Modal.Content scrolling>
            <Grid columns={COLUMNS}>
              { this.rows }
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.clear.bind(this)}>
              Clear
            </Button>
            <Button negative onClick={this.close.bind(this)}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
