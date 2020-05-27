'use strict'

const chai = require('chai')
const expect = chai.expect

const {
  getCookies,
  getUserKey
} = require('../utils')

describe('utils', () => {
  const id = 2
  const email = 'testmock@test.com'
  const username = 'testmock'
  let headers

  beforeEach(() => headers = {})

  describe('getUserKey', () => {
    it('Should get the user key as an email from login', () => {
      const userKey = getUserKey({ login: email })

      expect(userKey)
        .to.be.a('object')

      expect(userKey)
        .to.have.key('email')

      expect(userKey)
        .to.includes({ email })
    })

    it('Should get the user key as an username from login', () => {
      const userKey = getUserKey({ login: username })

      expect(userKey)
        .to.be.a('object')

      expect(userKey)
        .to.have.key('username')

      expect(userKey)
        .to.includes({ username })
    })

    it('Should get the user key as an id from body', () => {
      const userKey = getUserKey({ id })

      expect(userKey)
        .to.be.a('object')

      expect(userKey)
        .to.have.key('id')

      expect(userKey)
        .to.includes({ id })
    })
  })

  describe('getCookies', () => {
    it('Should return an empty cookies object', () => {
      const cookies = getCookies(headers)

      expect(cookies.size)
        .to.be.equal(0)
    })

    it('Should return the cookies object with the user', () => {
      headers.cookie = `user=${username}`
      const cookies = getCookies(headers)

      expect(cookies.size)
        .to.be.equal(1)

      expect(cookies.get('user'))
        .to.be.equal(username)
    })

    it('Should return the cookies object with 3 size', () => {
      headers.cookie = `user=${username}; email=${email}; test=testmock`
      const cookies = getCookies(headers)

      expect(cookies.size)
        .to.be.equal(3)
    })
  })
})
