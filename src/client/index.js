import './styles/body.less'
import Engine from './game/engine'
import Screenfull from 'screenfull'
import { viewport, FillViewport } from './game/viewport'
document.addEventListener('DOMContentLoaded', () => {
  const fullscreenButton = document.querySelector('#fullscreen')
  const root = document.querySelector('#game')

  fullscreenButton.addEventListener('click', function() {
    Screenfull.request(root)
  })

  Screenfull.on('change', function() {
    engine.handleWindowResize()
  })

  const engine = new Engine(root, new FillViewport(document.body))
})
