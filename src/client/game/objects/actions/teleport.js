/**
* Move player to other map, or other location on current map
*/
export default function teleport(action, entity) {
  let { type, location } = action
  let scene = entity.scene
  let { map } = scene.location

  return new Promise((resolve, reject) => {
    if (map == location.map) {
      scene.fade.fadeOut(() => {
        entity.setTile(location)
        scene.fade.fadeIn(resolve)
      })
    } else {
      scene.fade.fadeOut(() => {
        scene.goToMap(action.location)
        resolve()
      })
    }

  })
}
