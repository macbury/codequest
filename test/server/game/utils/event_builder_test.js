import { expect } from 'chai'
import EventBuilder from 'server/game/utils/event_builder'

describe('EventBuilder', function () {
  it('builds event data object', () => {
    let eb = new EventBuilder('foo: {{ hello.world }}', 'id')
    let output = eb.build({ hello: { world: 'bar' } })
    expect(output.foo).to.be.equal('bar')
  })
})
