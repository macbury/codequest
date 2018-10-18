import fs from 'fs'
import { expect } from 'chai'
import { stub } from 'sinon'

import Event from 'server/game/entities/components/event'
import Entity from 'server/game/entities/entity'
import Switches from 'server/game/utils/switches'

function buildEvent(fixturePath, state = {}) {
  let eventRecipe = fs.readFileSync(fixturePath).toString('utf8')
  let map = { game: { switches: new Switches() } }
  let entity = new Entity('test', state, map)
  let event = entity.components.add(Event, eventRecipe)
  return event
}

describe('Event', function () {
  describe('simple one page', function() {
    let event = buildEvent('test/fixtures/events/test.event.yaml', {
      location: {
        col: 5,
        row: 6,
        map: 'codest'
      }
    })

    it('starts with page 0', function() {
      expect(event.currentPageIndex).to.be.equal(0)
    })

    it('loads state', function() {
      expect(event.state.data.trigger).to.be.equal('Click')
      expect(event.state.data.blocking).to.be.equal(true)
      expect(event.state.data.direction).to.be.equal('left')
      expect(event.state.data.charset).to.be.equal('oldMan')
    })

    it('appends id and location to state', function() {
      expect(event.state.data.location.col).to.be.equal(5)
      expect(event.state.data.location.row).to.be.equal(6)
      expect(event.state.data.location.map).to.be.equal('codest')
    })
  })

  describe('#handleTrigger', function() {
    describe('with Touch trigger', function(done) {

    })

    describe('with Click trigger', function() {

    })
  })
})
