import React from 'react'
import { Menu } from 'semantic-ui-react'

export default class ContextMenu extends React.Component {
  get style() {
    let { visible, x, y } = this.props

    return {
      zIndex: 1000,
      position: 'fixed',
      display: (visible ? 'block' : 'none'),
      left: `${x}px`,
      top: `${y}px`
    }
  }

  handleClick() {
    console.log('Clicked!')
  }

  render() {
    return (
      <div style={this.style}>
        <Menu inverted vertical>
          {this.props.children}
        </Menu>
      </div>
    )
  }
}
