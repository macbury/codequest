import { expect } from 'chai'
import { spy } from 'sinon'
import { extractSwitchNames } from 'server/game/utils/event/conditions'

describe('utils/conditions', function() {
  describe('#extractSwitchNames', function() {
    it('extract switch names from 2 pages', function() {
      let pages = [
        {
          conditions: [
            { type: 'switch', key: 'a' }
          ]
        },

        {
          conditions: [
            { type: 'switch', key: 'b' }
          ]
        }
      ]

      expect(extractSwitchNames(pages)).to.be.deep.equal(['a', 'b'])
    })
  })
})
