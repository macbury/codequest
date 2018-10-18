import { expect } from 'chai'
import { load } from '../../src/server/game/maps/map_loader'
import MapData from '../../src/shared/map_data'

// describe('MapData', function () {
//   describe('#new', function() {
//     it('generates proper obstalce grid', function () {
//       let data = load('test/grid')
//       let mapData = new MapData(data)
//
//       expect(mapData.accaptableTileIds).to.be.an('array').that.includes(1)
//       expect(mapData.tileGrid).to.be.an('array')
//       expect(mapData.isPassable({ row: 0, col: 0 })).to.be.false
//       expect(mapData.isPassable({ row: 3, col: 3 })).to.be.true
//     })
//   })
// })
