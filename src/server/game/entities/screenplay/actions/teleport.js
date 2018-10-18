const logger = require('server/game/logger').get('actionTeleport')
export default async function actionTeleport(context) {
  let action = context.getAction()
  let { col, row, map } = action.payload.location

  if (map != context.map.name) {
    logger.debug(`Teleporting to other map: ${map}`)
    context.forceUpdate([action])
    context.player.state.set('location', { col, row, map }, true)
    context.player.removeFromCurrentMap()
  } else {
    logger.debug(`Teleporting on the same map: ${map}`)
    context.player.state.set('location', { col, row, map })
    await context.sendAndWait(action)
  }
}
