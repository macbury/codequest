

async function actionAsk(action, context) {
  let { choice } = await context.sendAndWait(action)
  context.setNextNodeTo(`output${choice}`)
}
