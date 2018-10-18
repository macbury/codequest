import React from 'react'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Treebeard, decorators } from 'react-treebeard'
import { arrangeIntoTree } from '../pages/maps/utils'

decorators.Header = ({style, node}) => {
  const iconName = node.children ? 'folder' : 'file text';
  const iconStyle = {marginRight: '5px'};

  return (
    <div style={style.base}>
      <div style={style.title}>
        <Icon name={iconName} style={iconStyle} />
        {node.name}
      </div>
    </div>
  )
}

export default class MapsTree extends React.Component {
  get data() {
    let { maps, selected } = this.props
    return arrangeIntoTree(maps, selected)
  }

  onToggle(node, toggled) {
    let { path, children } = node
    if (path) {
      this.props.onMapSelect(path)
    }

    if (children) {
      node.toggled = toggled
    }
  }


  render() {
    return (
      <div className="mapTree">
        <Treebeard
          decorators={decorators}
          data={this.data}
          onToggle={this.onToggle.bind(this)} />
      </div>
    )
  }
}
