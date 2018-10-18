import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'

import NavBar from './navbar'

export default class Layout extends React.Component {
  render() {
    let { children } = this.props
    return (
      <div>
        <NavBar />
        <Container fluid className="main-container">
          {children}
        </Container>
      </div>
    )
  }
}
