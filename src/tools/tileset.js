import Jimp from 'jimp'
//https://forums.rpgmakerweb.com/index.php?threads/chipset-composition.41286/
//https://rpgmaker.net/tutorials/975/
const logger = require('server/game/logger').get('server')
const inputTilesetPath = process.argv[2]
const outputTilesetPath = process.argv[3]

logger.info(`Input: ${inputTilesetPath}`)
logger.info(`Output: ${outputTilesetPath}`)

const autoTilesRects = [
  { x: 0, y: 128, width: 48, height: 64 },
  { x: 48, y: 128, width: 48, height: 64 },
  { x: 0, y: 192, width: 48, height: 64 },
  { x: 48, y: 192, width: 48, height: 64 },
  { x: 96, y: 0, width: 48, height: 64 },
  { x: 144, y: 0, width: 48, height: 64 },
  { x: 96, y: 64, width: 48, height: 64 },
  { x: 144, y: 64, width: 48, height: 64 },
  { x: 96, y: 128, width: 48, height: 64 },
  { x: 144, y: 128, width: 48, height: 64 },
  { x: 96, y: 192, width: 48, height: 64 },
  { x: 144, y: 192, width: 48, height: 64 }
]

function makeTransparentColor(image) {
  let transparentColor = image.getPixelColor(289, 129) // fetch first pixel from top left upper layer
  logger.info(`Making png transparent Color: ${transparentColor}`)
  for (var x = 0; x < image.bitmap.width; x++) {
    for (var y = 0; y < image.bitmap.height; y++) {
      if (image.getPixelColor(x, y) == transparentColor) {
        image.setPixelColor(0x00000000,x,y)
      }
    }
  }
}

function extractTilesParts(tilesetImage, rects) {
  let parts = []
  for (var i = 0; i < rects.length; i++) {
    let rect = rects[i]
    logger.debug(`Cutting tile part: ${JSON.stringify(rect)}`)
    let part = tilesetImage.clone()
    part.crop(rect.x, rect.y, rect.width, rect.height)
    parts.push(part)
  }
  return parts
}

function split(image, cols, rows) {
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

function transformPartToTerrain(autoTile) {
  let outerBorder = autoTile.clone().crop(0,16, 48, 48)
  let autoTileParts = split(autoTile, 3, 4)
  let outerCornersParts = split(autoTileParts[2][0], 2, 2)

  let innerBorder = new Jimp(48, 48)

  //TOP LEFT
  innerBorder.composite(autoTileParts[1][2], 0, 0)
  innerBorder.composite(outerCornersParts[1][1], 8, 8)
  //TOP CENTER
  innerBorder.composite(autoTileParts[1][3], 16, 0)
  //TOP RIGHT
  innerBorder.composite(autoTileParts[1][2], 32, 0)
  innerBorder.composite(outerCornersParts[0][1], 32, 8)

  //LEFT center
  innerBorder.composite(autoTileParts[2][2], 0, 16)
  //CENTER
  innerBorder.composite(autoTileParts[1][0], 16, 16)
  //RIGHT center
  innerBorder.composite(autoTileParts[0][2], 32, 16)

  //left bottom
  innerBorder.composite(autoTileParts[1][2], 0, 32)
  innerBorder.composite(outerCornersParts[1][0], 8, 32)
  //bottom center
  innerBorder.composite(autoTileParts[1][1], 16, 32)
  //right bottom
  innerBorder.composite(autoTileParts[1][2], 32, 32)
  innerBorder.composite(outerCornersParts[0][0], 32, 32)

  let finalTileset = new Jimp(96, 48)
  finalTileset.composite(outerBorder, 0, 0)
  finalTileset.composite(innerBorder, 48, 0)
  return finalTileset
}

function extractDetailsLayer(image) {
  return image.clone().crop(192,0, 288, 256)
}

function quickDump(images, prefix) {
  for (var i = 0; i < images.length; i++) {
    images[i].write(`./tmp/${prefix}_${i}.png`)
  }
}

Jimp.read(inputTilesetPath, (err, inputTilesetImage) => {
  if (err) {
    logger.error(err)
    return
  }
  makeTransparentColor(inputTilesetImage)
  logger.info('Extracting auto tile parts')
  let autoTiles = extractTilesParts(inputTilesetImage, autoTilesRects)
  logger.info('Transforming auto tiles to tiled format')

  let terrainWidth = 96
  let terrainHeight = 48
  let terrainLayer = new Jimp(192+288, 288)
  let row = 0
  for (var i = 0; i < autoTiles.length; i+=2) {
    let autoTileLeft = transformPartToTerrain(autoTiles[i])
    let autoTileRight = transformPartToTerrain(autoTiles[i+1])

    terrainLayer.composite(autoTileLeft, 0, row * terrainHeight)
    terrainLayer.composite(autoTileRight, terrainWidth, row * terrainHeight)
    row++
  }

  logger.info('Extracting details')
  let detailsLayer = extractDetailsLayer(inputTilesetImage)
  terrainLayer.composite(detailsLayer, 192, 0)

  logger.info(`Saving: ${outputTilesetPath}`)
  terrainLayer.write(outputTilesetPath)
})
