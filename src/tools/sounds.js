import audiosprite from 'audiosprite'
import path from 'path'
import fs from 'fs'
const opts = {output: 'result'}
const inputDir = './src/raw/sounds/'

fs.readdir(inputDir, function (err, files) {
  console.log(files)
  audiosprite(files, opts, function(err, obj) {
    if (err) return console.error(err)

    console.log(JSON.stringify(obj, null, 2))
  })
})
