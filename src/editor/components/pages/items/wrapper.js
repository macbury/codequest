import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ItemList from './list'
import { Grid, Button, Segment } from 'semantic-ui-react'

class Wrapper extends React.Component {
  onNewItemClick(ev) {
    let { history } = this.props
    history.push('/items/new')
  }

  render() {
    let { items, children } = this.props
    return (
      <Grid padded stretched>
        <Grid.Column width={4}>
          <Segment.Group>
            <Segment>
              <Button fluid secondary onClick={this.onNewItemClick.bind(this)}>Add item</Button>
            </Segment>
            <Segment>
              <ItemList items={items} />
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column width={12}>
          {children}
        </Grid.Column>
      </Grid>
    )
  }
}

function mapStateToProps({ items }) {
  return { items }
}

export default withRouter(connect(mapStateToProps, {})(Wrapper))
