/**
* Send information to server about resuming this play
*/
export default function act(action, entity) {
  return new Promise((resolve, reject) => {
    entity.scene.events.emit('client:nextAct')
    resolve()
  })
}
