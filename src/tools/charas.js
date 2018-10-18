import Jimp from 'jimp'
const logger = require('server/game/logger').get('charas')
const STORE_DIR = './src/raw/processed/charsets/dynamic'


const sk = 1523764800 //expires every day, fetch it from http://www.charas-project.net

const directionsRanges = [
  { name: 'up', frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: 'right', frames: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { name: 'down', frames: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }] },
  { name: 'left', frames: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }] }
]

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

function split(base, type) {
  const width  = 24
  const height = 32
  for (var i = 0; i < directionsRanges.length; i++) {
    let { name, frames } = directionsRanges[i]
    for (var fi = 0; fi < frames.length; fi++) {
      let rect = frames[fi]
      let path = `${STORE_DIR}/${type}/${name}${fi}.png`
      let part = base.clone()
      part.crop(rect.x * width, rect.y * height, width, height)
      logger.info(`Saving: ${path}`)
      part.write(path)
    }
  }
}


const resources = [
  {
    type: 'shared/head',
    range: [
      125, 5836, 5838, 5839, 126, 127, 1727,
      123, 5762, 1121, 25451, 25450, 746, 5786, 5763,
      119, 5430,
      1685, 898, 897, 894,
      121, 4996, 4997, 4998, 1825, 122, 1245, 1246, 1247, 1248,
      4885,
      5036, 5037, 5038, 5039, 5040, 5041, 5042, 5043, 5044, 5045, 5046, 1244
    ]
  },
  { type: 'male/body', range: [115] },
  { type: 'female/body', range: [14014] },
  {
    type: 'male/hair',
    range: [
      4266, 175, 1514, 5714, 4541, 4734, 1687, 5629, 2232, 2229, 5632, 2050, 11515, 174, 827, 755, 177, 181, 182, 558, 924, 914,
      2236, 2235, 2234, 2230, 5630, 5631, 21896, 21897, 5716, 5705, 5709, 849, 847, 846, 845, 829, 4937, 352, 353, 354, 355,
      16399, 676, 749, 5753, 750, 751, 752, 300, 301, 302, 303, 304, 305, 306
    ]
  },

  {
    type: 'female/hair',
    range: [
      4472, 4423, 4425, 4426, 4427, 4428,
      4473, 4267,
      4331, 4331,
      3857,
      1456,
      609, 610, 611,
      623, 5168, 624, 625,
      23383, 25203, 19775,
      25514, 23789,
      22142, 22140, 22143,
      803,
      2101, 2110, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109,
      21304,
      673, 4674, 4675, 5173, 4676
    ]
  },
  { type: 'shared/hat', range: [273, 1142, 1311, 678, 4475, 5718, 1659, 650] },
  {
    type: 'shared/armor',
    range: [
      781, //uniform geeka,
      1399, //uniform programisty,
      17446, //uniform adopsa
      //10723, 1980, 11864, 4497,1838, 778, 2671, 23201, 753, 17446, 4999, 4856, 4508, 1458, 1388, 4484, 1809, 965, 205, 1234, 5005, 783, 959, 962, 4909, 2170, 421
    ]
  },
  { type: 'male/shorts', range: [943] },
  { type: 'female/shorts', range: [813] }
]

for (var i = 0; i < resources.length; i++) {
  let { type, start, end, range } = resources[i]
  if (range == null) {
    range = []
    for (var index = start; index <= end; index++) {
      range.push(index)
    }
  }

  for (var k = 0; k < range.length; k++) {
    let index = range[k]
    let name = `${type}/${k}`
    let url = `http://www.charas-project.net/charas2/res_viewer.php?sk=${sk}&img=${index}`
    logger.info(`Downloading: ${url}`)
    Jimp.read(url).then(function (image) {
      makeTransparentColor(image)
      logger.info(`Downloaded: ${url} time for splitting!`)
      split(image, name)
    })
  }
}
