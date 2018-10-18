import { createLogger, format, transports } from 'winston'
import emoji from 'node-emoji'
import chalk from 'chalk'
const { combine, timestamp, label, printf } = format

const colors = {
  debug: chalk.yellow,
  info: chalk.green,
  error: chalk.red
}

const serverFormat = printf(info => {
  let tag = colors[info.level](`(${info.label}:${info.level})`)
  return emoji.emojify(` :crossed_swords:  ${tag} ${info.message}`)
})

export function get(tag) {
  return createLogger({
    level: 'debug',
    transports: [
      new transports.Console()
    ],
    format: combine(
      label({ label: tag }),
      timestamp(),
      serverFormat
    )
  })
}
