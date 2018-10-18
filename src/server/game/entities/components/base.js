import Component from 'shared/component'

export default class Base extends Component {
  get socket() {
    return this.entity.socket
  }

  get localEvents() {
    return this.entity.localEvents
  }

  get server() {
    return this.entity.server
  }

  get repositories() {
    return this.server.repositories
  }

  get state() {
    return this.entity.state
  }

  get userId() {
    return this.entity.userId
  }

  get id() {
    return this.entity.id
  }

  get currentMap() {
    return this.entity.currentMap
  }

  get eventMap() {
    return this.currentMap.eventMap
  }

  get switches() {
    return this.currentMap.game.switches
  }

  remove() {
    this.entity.components.remove(this)
  }
}
