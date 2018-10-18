import createHistory from 'history/createHashHistory'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import itemsReducer from './items'
import mapsReducer from './maps'

const history = createHistory()

const store = createStore(
  combineReducers({
    router: routerReducer,
    items: itemsReducer,
    maps: mapsReducer,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    routerMiddleware(history),
    thunkMiddleware
  )
)

export {
  history,
  store
}
