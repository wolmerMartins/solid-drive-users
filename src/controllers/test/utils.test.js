'use strict'

const chai = require('chai')
const expect = chai.expect

const { getUserKeyFromLogin } = require('../utils')

describe('utils', () => {
  const email = 'testmock@test.com'
  const username = 'testmock'

  describe('getUserKeyFromLogin', () => {
    it('Should get the user key as an email from login', () => {
      const userKey = getUserKeyFromLogin({ login: email })

      expect(userKey)
        .to.be.a('object')

      expect(userKey)
        .to.have.key('email')

      expect(userKey)
        .to.includes({ email })
    })

    it('Should get the user key as an username from login', () => {
      const userKey = getUserKeyFromLogin({ login: username })

      expect(userKey)
        .to.be.a('object')

      expect(userKey)
        .to.have.key('username')

      expect(userKey)
        .to.includes({ username })
    })
  })
})
