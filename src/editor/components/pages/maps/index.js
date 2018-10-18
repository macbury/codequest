import React from 'react'
import { Grid, Message } from 'semantic-ui-react'
import { withMapsLoader } from './provider'
import Wrapper from './wrapper'

class MapsIndexPage extends React.Component {
  render() {
    return (
      <Wrapper>
        <div>
          <Message>
            <p>Select map from sidebar</p>
          </Message>
        </div>

      </Wrapper>
    )
  }
}

export default withMapsLoader(MapsIndexPage)
