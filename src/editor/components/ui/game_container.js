import React from 'react'
import CoreEngine from '../../../client/game/core'
import MapEditorScene from '../../../client/game/scenes/editor/map'

const SCALE = 2

class ContainerViewport {
  constructor(container) {
    this.container = container
  }

  update() {
    let viewportWidth = this.container.parentElement.clientWidth
    let viewportHeight = this.container.parentElement.clientHeight
    return {
      worldWidth: viewportWidth / SCALE,
      worldHeight: viewportHeight / SCALE,
      viewportWidth,
      viewportHeight,
      marginTop: 0
    }
  }
}

class ContainerEngine extends CoreEngine {
  create() {
    super.create()

    this.events.emit('edit:boot')
  }

  openMap(map) {
    this.scene.remove('mapEditor')
    this.scene.add('mapEditor', MapEditorScene)
    this.scene.start('mapEditor', { map })
  }
}

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mapWidth: 300, mapHeight: 300
    }
  }

  componentDidMount() {
    let { map } = this.props
    let mapEditorDiv = this.el.parentElement
    this.viewport = new ContainerViewport(mapEditorDiv)
    this.engine = new ContainerEngine(
      this.el,
      this.viewport
    )

    this.engine.events.on('map:sizeChanged', ({ mapWidth, mapHeight }) => {
      this.setState({ mapWidth, mapHeight })
    })

    this.engine.events.on('mapScene:boot', (mapScene) => {
      let { events, onOpenMap } = this.props
      this.mapScene = mapScene
      this.updateEvents(events)
      mapScene.events.on('map:tileClicked', this.handleTileClick.bind(this))
      if (onOpenMap) {
        onOpenMap(mapScene)
      }
    }, this)

    if (map != null) {
      this.openMap(map)
    }
  }

  handleTileClick({ tile, pointer }) {
    if (pointer.buttons == 2 && this.props.onShowMenu) {
      this.props.onShowMenu(tile, pointer)
    } else if (this.props.onTileDoubleClick && this.lastTile && (this.lastTile.col == tile.col && this.lastTile.row == tile.row)) {
      this.props.onTileDoubleClick(tile, pointer)
    } else if (this.props.onTileClick) {
      this.props.onTileClick(tile, pointer)
      this.lastTile = tile
    }

  }

  updateEvents(events) {
    if (this.mapScene == null) {
      return
    }

    if (events == null) {
      return
    }

    this.mapScene.events.emit('edit:updateEvents', events)
  }

  openMap(mapName) {
    let events = this.engine.events
    this.lastTile = null
    if (this.engine.isRunning) {
      this.engine.openMap(mapName)
    } else {
      events.once('edit:boot', () => {
        this.engine.openMap(mapName)
      }, this)
    }
  }

  componentWillReceiveProps(nextProps) {
    let nextMap = nextProps.map
    if (nextMap != this.props.map) {
      this.openMap(nextMap)
    }

    let events = nextProps.events
    this.updateEvents(events)
  }

  componentWillUnmount() {
    this.engine.destroy()
    this.engine = null
  }

  get containerStyle() {
    if (this.viewport == null) {
      return {}
    }
    let { mapWidth, mapHeight } = this.state
    let width = (mapWidth*SCALE)
    let height = (mapHeight*SCALE)
    return {
      width: `${width}px`,
      height: `${height}px`
    }
  }

  render() {
    return(
      <div className="mapScroller">
        <div className="mapContainer" style={this.containerStyle}>
          <div ref={el => this.el = el} className={this.props.className} />
          {this.props.children}
        </div>
      </div>
    )
  }
}
