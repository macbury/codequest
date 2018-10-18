import React, { Component } from 'react'
import { Container, Image, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const NavBar = () => (
  <Menu fixed='top' inverted>
    <Container fluid>
      <Menu.Item>
        <Link to="/">Items</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/maps">Maps</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/quests">Quests</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/switches">Switches</Link>
      </Menu.Item>
    </Container>
  </Menu>
)

export default NavBar
