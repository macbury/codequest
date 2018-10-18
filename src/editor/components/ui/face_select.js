import React from 'react'
import _ from 'underscore'
import { Button, Header, Modal, Grid } from 'semantic-ui-react'

import charasAtlasContent from '../../../assets/facesets.json?load-inline'
import charasAtlasImagePath from '../../../assets/facesets.png'

const FRAMES = charasAtlasContent.frames.reduce((acc, { filename, frame }) => {
  acc[filename] = frame
  return acc
}, {})


const FaceIcon = (props) => {
  let { name, style } = props
  let frame = FRAMES[name] || { x: 0, y: 0, h: 0, w: 0 }
  let { x, y, w, h } = frame
  let upStyle = style || {}

  let baseStyle = {
    display: 'inline-block',
    background: `transparent url(${charasAtlasImagePath})`,
    backgroundPosition: `${-x}px ${-y}px`,
    width: `${w}px`,
    height: `${h}px`,
    imageRendering: 'pixelated'
  }

  return <div className="face-icon" style={{...baseStyle, ...upStyle}} {...props}/>
}

const COLUMNS = 8

class FaceDialog extends React.Component {
  constructor(props) {
    super(props)
    this.items = _.chunk(Object.keys(FRAMES), COLUMNS)
  }

  onOptionSelect(filename, ev) {
    let { onOptionSelect } = this.props
    onOptionSelect(filename)
  }

  renderOptions(options) {
    return options.map((filename) => {
      let selected = this.props.value == filename
      return (
        <div value={filename} className={selected ? 'face-option face-option-selected' : 'face-option'} key={filename} onClick={this.onOptionSelect.bind(this, filename)}>
          <FaceIcon name={filename} />
        </div>
      )
    })
  }

  get rows() {
    return this.items.map((row, index) => {
      return (
        <Grid.Row key={ index } className="face-select">
          { this.renderOptions(row) }
        </Grid.Row>
      )
    })
  }

  render() {
    let { open, onClose, onClear } = this.props
    return (
      <Modal dimmer="blurring" size="fullscreen" open={open} onClose={onClose}>
        <Modal.Header>
          Find faceset
        </Modal.Header>
        <Modal.Content scrolling>
          <Grid columns={COLUMNS}>
            { this.rows }
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClear}>
            Clear
          </Button>
          <Button negative onClick={onClose}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default class FaceSelect extends React.Component {
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
    this.onClose()
    this.props.onFaceSelect(null)
  }

  handleOptionSelect(filename) {
    this.onClose()
    let { onFaceSelect } = this.props
    onFaceSelect(filename)
  }

  render() {
    let { value } = this.props
    let { open } = this.state
    return (
      <div className="face-select">
        <div onClick={this.onOpen.bind(this)} className="current-face-button">
          <FaceIcon name={value} />
        </div>

        <FaceDialog
          open={open}
          onClear={this.onClear.bind(this)}
          onClose={this.onClose.bind(this)}
          onOptionSelect={this.handleOptionSelect.bind(this)} />
      </div>
    )
  }
}
