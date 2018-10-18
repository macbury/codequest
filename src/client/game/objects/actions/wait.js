/**
* Display message box
*/
export default function wait(action, player) {
  let { time } = action

  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
