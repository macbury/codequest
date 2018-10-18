import { processAction } from './actions'
import { actions, ActionContext } from './actions'
const logger = require('server/game/logger').get('Screenplay')

function findNodePort({ ports }, portName) {
  return ports.find((port) => port.type == portName)
}

function arrToIdHash(objects) {
  return objects.reduce((output, node) => {
    output[node.id] = node
    return output
  }, {})
}

/**
* This build all steps that are going to be sended to client
*/
export default class Screenplay {
  /**
  * Construct object
  * @param {Entity} entity that triggers event
  * @param {Object} entityGraph
  */
  constructor(owner, { nodes, links }) {
    this.owner = owner
    this.recipe = []
    this.nodes = arrToIdHash(nodes)
    this.links = arrToIdHash(links)
    this.currentNode = nodes.find(({ type }) => type == 'trigger')
    this.nextNode = this.peekNode()
  }

  peekNode() {
    if (this.currentNode == null) {
      return null
    }

    let port = findNodePort(this.currentNode, 'output')
    if (port == null) {
      return null
    }

    let link = this.links[port.links[0]]
    if (link == null) {
      return null
    }

    let node = this.nodes[link.target]
    if (node.id == this.currentNode.id) {
      return this.nodes[link.source]
    } else {
      return node
    }
  }

  popNode() {
    this.currentNode = this.nextNode
    this.nextNode = this.peekNode()
    return this.currentNode != null
  }

  /**
  * Run play
  * @param {Player} player that triggers this event
  * @return {boolean} true if there are still actions
  */
  async run(player) {
    let context = new ActionContext(this.owner, player, this)

    while(this.popNode()) {
      let { type } = this.currentNode
      let serverAction = actions[type] || actions['default']
      await serverAction(context)
    }
  }

  dispose() {
    this.owner = null
    this.recipe = null
  }
}
