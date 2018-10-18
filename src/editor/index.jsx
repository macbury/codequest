import 'semantic-ui-css/semantic.min.css'
import './styles/index.less'

import React from 'react'
import ReactDOM from 'react-dom'

import { store, history } from './reducers'
import Application from './components'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#editor')
  ReactDOM.render(<Application store={store} history={history} />, root)
})
