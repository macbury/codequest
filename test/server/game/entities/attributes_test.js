import { expect } from 'chai'
import Attributes from 'server/game/entities/attributes'

describe('Attributes', function () {
  describe('#new', function() {
    it('is dirty at start', function () {
      let attrs = new Attributes({ a: 's' })
      expect(attrs.isDirty()).to.be.true
    })
  })

  describe('#set', function() {
    it('marks attribute as dirty', function () {
      let attrs = new Attributes({})
      attrs.markAsClean()
      attrs.set('hello', 'world')
      expect(attrs.isDirty()).to.be.true
    })

    it('dont marks attribute as dirty', function () {
      let attrs = new Attributes({})
      attrs.markAsClean()
      attrs.set('hello', 'world', true)
      expect(attrs.isDirty()).to.be.false
    })
  })

  describe('#[]', function() {
    it('reads from data', function () {
      let attrs = new Attributes({ hello: 'world' })
      expect(attrs.get('hello')).to.be.eq('world')
    })
  })

  describe('#markAsClean', function() {
    it('resets changes', function () {
      let attrs = new Attributes({})
      attrs.markAsClean()
      expect(attrs.isDirty()).to.be.false
    })
  })

  describe('#isDirty', function() {
    it('detect when attribute did change', function () {
      let attrs = new Attributes({})
      attrs.markAsClean()
      attrs.set('foo', 'bar')
      expect(attrs.isDirty()).to.be.true
    })
  })
})
