import React from 'react'
import { Grid, Message } from 'semantic-ui-react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import MapsTree from '../../ui/maps_tree'

class Wrapper extends React.Component {
  onMapSelect(path) {
    this.props.history.push(`/maps/${path}`)
  }

  render() {
    let { maps, selected } = this.props
    return (
      <Grid stretched padded>
        <Grid.Column width={3}>
          <MapsTree
            maps={maps}
            selected={selected}
            onMapSelect={this.onMapSelect.bind(this)} />
        </Grid.Column>
        <Grid.Column width={13}>
          {this.props.children}
        </Grid.Column>
      </Grid>
    )
  }
}

function mapStateToProps({ maps }) {
  let { selected, all } = maps
  return {
    selected,
    maps: all
  }
}

export default withRouter(connect(mapStateToProps)(Wrapper))
