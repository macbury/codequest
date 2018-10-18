import Jimp from 'jimp'
import fs from 'fs'
import path from 'path'
import _ from 'underscore'

const logger = require('server/game/logger').get('extract-charsets')
const STORE_DIR = './src/raw/processed/charsets/static/'
const INPUT_DIR = './src/raw/charsets/'

const directionsRanges = [
  { name: 'up', frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: 'right', frames: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { name: 'down', frames: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
  { name: 'left', frames: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }] }
]

function splitCharsetsAtlas(image, cols, rows) {
  let width = image.bitmap.width / cols
  let height = image.bitmap.height / rows
  let grid = new Array(cols)
  for (var x = 0; x < cols; x++) {
    if (grid[x] == null) {
      grid[x] = new Array(rows)
    }
    for (var y = 0; y < rows; y++) {
      grid[x][y] = image.clone().crop(x * width, y * height, width, height)
    }
  }

  return grid
}

function splitCharset(dir, base) {
  const width  = 24
  const height = 32
  for (var i = 0; i < directionsRanges.length; i++) {
    let { name, frames } = directionsRanges[i]
    for (var fi = 0; fi < frames.length; fi++) {
      let rect = frames[fi]
      let path = `${dir}/${name}${fi}.png`
      let part = base.clone()
      part.crop(rect.x * width, rect.y * height, width, height)
      logger.info(`Saving: ${path}`)
      part.write(path)
    }
  }
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

function extractFrom(charsetImagePath) {
  let name = path.basename(charsetImagePath, '.png')
  Jimp.read(charsetImagePath, (err, charsetImage) => {
    if (err) throw err
    makeTransparentColor(charsetImage)
    let parts = _.flatten(splitCharsetsAtlas(charsetImage, 4, 2))

    for (var i = 0; i < parts.length; i++) {
      let part = parts[i]
      let dir = `${STORE_DIR}/${name}/${i}`
      splitCharset(dir, part)
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
