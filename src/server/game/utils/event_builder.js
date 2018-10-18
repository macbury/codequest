import Handlebars from 'handlebars'
import YAML from 'js-yaml'
const logger = require('../logger').get('EventBuilder')
import { Direction } from 'shared/consts'

export default class EventBuilder {
  constructor(source) {
    this.source = source
  }

  build(context) {
    try {
      let compiledYaml = this.template(context)
      let { pages } = YAML.load(compiledYaml)

      for (var i = 0; i < pages.length; i++) {
        let { state } = pages[i]
        if (state.direction) {
          state.direction = Direction.get(state.direction).value
        }

        pages[i].state = state
      }

      return { pages }
    } catch (e) {
      logger.error(`Error while trying to build ${this.source}:`)
      throw e
    }
  }

  get template() {
    if (this._template == null) {
      this._template = Handlebars.compile(this.source)
    }
    return this._template
  }
}
