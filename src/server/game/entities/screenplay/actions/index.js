import _ from 'underscore'

export class ActionContext {
  constructor(entity, player, screenplay) {
    this.entity = entity
    this.player = player
    this.screenplay = screenplay
  }

  get map() {
    return this.player.currentMap
  }

  get switches() {
    return this.player.switches
  }

  get currentNode() {
    return this.screenplay.currentNode
  }

  nextUpdate() {
    return this.map.onNextUpdate()
  }

  nextAct() {
    return new Promise((resolve) => { this.player.localEvents.once('client:nextAct', resolve) })
  }

  getSetterValue(setter) {
    let linkId = setter.links[0]
    let link = this.screenplay.links[linkId]
    if (link == null) {
      return null
    }

    let node = this.screenplay.nodes[link.source]
    if (node == null) {
      return null
    }

    return node.payload.value
  }


  getAction() {
    let { type, payload } = this.currentNode

    let variables = this.currentNode.ports.filter(({ type }) => type == 'setter').reduce((output, setter) => {
      output[setter.name] = this.getSetterValue(setter)
      return output
    }, {})

    let extendedPayload = {...payload, ...variables}
    return { type, payload: extendedPayload }
  }

  nextNode() {
    this.screenplay.popNode()
  }

  setNextNodeTo(currentNodePortName) {
    //todo output port with name
    //this.screenplay.nextNode = nextOutput
  }

  async emit(actions) {
    this.player.actions = actions
    await this.nextUpdate()
  }

  forceUpdate(actions) {
    this.player.actions = actions
    this.player.sendUpdate()
  }

  /**
  * Send action to player
  */
  async send(actions) {
    await this.emit(_.flatten([actions, { type: 'act' }]))
  }

  async sendAndWait(actions) {
    await this.send(actions)
    await this.nextAct()
  }
}

/**
* Just send action to player on next update
*/
async function actionDefault(context) {
  let action = context.getAction()
  await context.sendAndWait(action)
}

import actionTeleport from './teleport'
import actionSwitch from './switch'
export const actions = {
  'switch': actionSwitch,
  'teleport': actionTeleport,
  'default': actionDefault
}
