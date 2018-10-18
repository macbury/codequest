import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Router, Route, browserHistory, Redirect, Switch } from 'react-router-dom'

import Layout from './shared/layout'
import MapsIndexPage from './pages/maps'
import MapsEditPage from './pages/maps/edit'
import ItemsPage from './pages/items'
import NewItemPage from './pages/items/new'
import ItemsEditPage from './pages/items/edit'
import SwitchesPage from './pages/switches'

import NewEventPage from './pages/maps/events/new'
import EditEventPage from './pages/maps/events/edit'

export default class Application extends Component {
  render() {
    let { store, history } = this.props
    return (
      <Provider store={store}>
        <Router history={history}>
          <Layout>
            <Route exact path="/" render={() => <Redirect to="/items"/>} />
            <Switch>
              <Route exact path="/maps" component={MapsIndexPage}></Route>
              <Route exact path="/maps/*/events/:id" component={EditEventPage}></Route>
              <Route exact path="/maps/*/events/new/:col,:row" component={NewEventPage}></Route>
              <Route exact path="/maps/*" component={MapsEditPage}></Route>
            </Switch>
            <Switch>
              <Route exact path="/items" component={ItemsPage}></Route>
              <Route path="/items/new" component={NewItemPage}></Route>
              <Route path="/items/:itemId" component={ItemsEditPage}></Route>
            </Switch>
            <Route exact path="/switches" component={SwitchesPage} />
          </Layout>
        </Router>
      </Provider>
    )
  }
}
