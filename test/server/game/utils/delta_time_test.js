import { expect } from 'chai'
import DeltaTime from 'server/game/utils/delta_time'

describe('DeltaTime', function () {
  describe('#new', function() {
    it('delta is 0 at start', function () {
      let deltaTime = new DeltaTime()
      expect(deltaTime.get()).to.be.equal(0)
    })
  })

  describe('#update', function() {
    it('updates delta', function (done) {
      this.timeout(200)
      let deltaTime = new DeltaTime()
      setTimeout(function () {
        deltaTime.update()
        expect(deltaTime.get()).to.be.within(100, 110)
        done()
      }, 100)
    })
  })
})
