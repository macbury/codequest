const logger = require('server/game/logger').get('actionSwitch')

export default async function actionSwitch(context) {
  logger.info('switch!')
  let action = context.getAction()
  let { name, targetState, expireIn } = action.payload
  context.switches.set(name, targetState)
  if (expireIn) {
    context.switches.expireIn(name, expireIn)
  }
  await context.nextUpdate()
  //context.nextNode()
  logger.info('Mext node!')
}
