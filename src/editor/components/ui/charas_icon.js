import React from 'react'
import _ from 'underscore'

import charasImagePath from '../../../assets/characters/charas.png'
import { frames } from '../../../assets/characters/charas.json?load-inline'

const FRAMES = _.reduce(frames, function(acc, { filename, frame }) {
  acc[filename] = frame
  return acc
}, {})

export default class CharasIcon extends React.Component {
  get frame() {
    return FRAMES[this.props.name] || {
      x: 0,
      y: 0,
      h: 0,
      w: 0
    }
  }
  render() {
    let { x, y, w, h } = this.frame
    let upStyle = this.props.style || {}

    let style = {
      display: 'inline-block',
      background: `transparent url(${charasImagePath})`,
      backgroundPosition: `${-x}px ${-y}px`,
      width: `${w}px`,
      height: `${h}px`,
      imageRendering: 'pixelated'
    }
    return <div className="chara-icon" style={{...style, ...upStyle}} {...this.props}/>
  }
}
