import Jimp from 'jimp'
import fs from 'fs'
import path from 'path'
import _ from 'underscore'

const logger = require('server/game/logger').get('extract-facesets')
const STORE_DIR = './src/raw/processed/facesets/'
const INPUT_DIR = './src/raw/facesets/'


function splitAtlas(image, cols, rows) {
  let width = image.bitmap.width / cols
  let height = image.bitmap.height / rows
  let output = new Array()
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      output.push(image.clone().crop(x * width, y * height, width, height))
    }
  }

  return output
}

function makeTransparentColor(image) {
  let transparentColor = image.getPixelColor(0, 0)
  logger.info(`Making png transparent Color: ${transparentColor}`)
  for (var x = 0; x < image.bitmap.width; x++) {
    for (var y = 0; y < image.bitmap.height; y++) {
      if (image.getPixelColor(x, y) == transparentColor) {
        image.setPixelColor(0x00000000,x,y)
      }
    }
  }
}

function extractFrom(facesetImagePath) {
  let name = path.basename(facesetImagePath, '.png')
  Jimp.read(facesetImagePath, (err, facesetImage) => {
    if (err) throw err
    let parts = splitAtlas(facesetImage, 4, 4)

    for (var i = 0; i < parts.length; i++) {
      let part = parts[i]
      let path = `${STORE_DIR}/${name}/${i}.png`
      logger.info(`Saving ${path}`)
      part.write(path)
    }
  })
}

fs.readdirSync(INPUT_DIR).forEach(filePath => {
  if (filePath.endsWith('.png')) {
    filePath = INPUT_DIR + filePath
    logger.info(`Extracting: ${filePath}`)
    extractFrom(filePath)
  }
})
