/**
* Display message box
*/
export default function message({ content, face, name }, player) {
  let { messageWindow } = player.scene

  return new Promise((resolve) => {
    messageWindow.open().then(() => {
      messageWindow.showText(content, name, face).then(() => {
        messageWindow.close()
        resolve()
      })
    })
  })
}
