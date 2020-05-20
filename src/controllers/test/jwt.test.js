'use strict'

const chai = require('chai')
const expect = chai.expect

const { generateToken } = require('../jwt')

describe('jwt', () => {
  const id = 6
  const username = 'testmock'
  const channel = 'user:testmock'
  const email = 'testmock@test.com'

  describe('generateToken', () => {
    it('Should receive a payload and return a JWT token', async () => {
      const token = await generateToken({ id, email, channel, username })

      expect(token)
        .to.have.length(239)

      expect(token.split('.'))
        .to.have.length(3)
    })

    it('Should return an error trying to generate token', async () => {
      try {
        await generateToken(undefined)
      } catch(err) {
        expect(err)
          .to.be.a('error')

        expect(err.message)
          .to.be.equal('payload is required')
      }
    })
  })
})
