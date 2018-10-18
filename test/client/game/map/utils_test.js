'use strict'

import { expect } from 'chai'
import { tileToWorldPosition } from '../../../../src/shared/map_utils'

describe('map utils', function () {
  describe('#tileToWorldPosition', function() {
    it('converts tile coords to world coords', function () {
      let worldCoords = { x: 1, y: 2 }
      let tile = { col: 5, row: 3 }
      tileToWorldPosition(tile, worldCoords)

      expect(worldCoords.x).to.eq(80)
      expect(worldCoords.y).to.eq(48)
    })
  })
})
