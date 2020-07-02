'use strict'

const chai = require('chai')
const redisMock = require('redis-mock')

const session = require('../Session')

const expect = chai.expect

describe('Session', () => {
  const username = 'test'
  const token = 'lakjsdlkajsoihdalskjdasjd'

  before(() => {
    const client = redisMock.createClient()
    session(client)
  })

  describe('initUserSession', () => {
    it('Should initialize the user session', async () => {
      const result = await session.initUserSession(username, token)

      expect(result)
        .to.be.ok
    })
  })

  describe('getUserSessionToken', () => {
    it('Should return the user auth token', async () => {
      const result = await session.getUserSessionToken(username)

      expect(result)
        .to.be.equal(token)
    })
  })

  describe('endUserSession', () => {
    it('Should remove the user token from cache', async () => {
      const result = await session.endUserSession(username)

      expect(result)
        .to.be.equal(1)
    })
  })
})
