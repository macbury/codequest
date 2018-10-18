import { expect } from 'chai'
import { spy } from 'sinon'
import Switches from 'server/game/utils/switches'

describe('Switches', function () {
  describe('#set', function() {
    it('with true', (done) => {
      let switches = new Switches()
      switches.events.on('changed:test', (key, state) => {
        expect(key).to.be.equal('test')
        expect(state).to.be.equal(true)
        done()
      })
      switches.set('test', true)
    })

    it('with false', (done) => {
      let switches = new Switches()
      switches.events.on('changed:hello', (key, state) => {
        expect(key).to.be.equal('hello')
        expect(state).to.be.equal(false)
        done()
      })
      switches.set('hello', false)
    })

    it('the same value', () => {
      let switches = new Switches()
      let callback = spy()
      switches.events.on('changed:foo', callback)
      switches.set('foo', true)
      switches.set('foo', true)
      expect(callback.calledOnce).to.be.true
    })
  })

  describe('#expire', function() {
    it('expire key after 10 miliseconds', function(done) {
      let switches = new Switches()
      switches.set('key', true)
      switches.expireIn('key', 0.01)
      setTimeout(() => {
        switches.update()
        expect(switches.isOff('key')).to.be.true
        done()
      }, 100)
    })

    it('dont expire key after 10 miliseconds', function(done) {
      let switches = new Switches()
      switches.set('key', true)
      switches.expireIn('key', 1.01)
      setTimeout(() => {
        switches.update()
        expect(switches.isOff('key')).to.be.false
        done()
      }, 100)
    })
  })
})
