'use strict'

const chai = require('chai')
const redisMock = require('redis-mock')

const session = require('../Session')

const expect = chai.expect

describe('Session', () => {
  before(() => {
    const client = redisMock.createClient()
    session(client)
  })

  describe('initUserSession', () => {
    it('Should initialize the user session', async () => {
      const result = await session.initUserSession('test', 'lakjsdlkajsoihdalskjdasjd')

      expect(result)
        .to.be.ok
    })
  })
})
