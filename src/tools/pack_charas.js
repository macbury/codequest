const fs = require('fs')
const spritesheet = require('spritesheet-js')
const logger = require('server/game/logger').get('charas:pack')
const STORE_DIR = './tmp/charsets'
const OUTPUT_DIR = './src/assets/characters'

const options = {
  format: 'json',
  path: OUTPUT_DIR,
  name: 'charas',
  trim: false,// empty ones are throwing errors...
  fullpath: true,
  padding: 2
  // algorithm: 'binpacking',
  // width: 512,
  // height: 512
}

logger.info(`Packing in ${STORE_DIR}/**/*.png`)
spritesheet(`${STORE_DIR}/**/*.png`, options, function (err) {
  if (err) throw err

  logger.info('spritesheet successfully generated')

  let charsetJsonPath = `${OUTPUT_DIR}/${options.name}.json`
  logger.info(`Fixing paths: ${charsetJsonPath}`)

  var pathRegexp = new RegExp(STORE_DIR+'/', 'g')
  let spritesheetRaw = fs.readFileSync(charsetJsonPath, 'utf8')
  spritesheetRaw = spritesheetRaw.replace(pathRegexp, '')
  fs.writeFileSync(charsetJsonPath, spritesheetRaw)
})
