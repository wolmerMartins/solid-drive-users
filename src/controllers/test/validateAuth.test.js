'use strict'

const chai = require('chai')
const redisMock = require('redis-mock')

const Session = require('../../models/Session')

const expect = chai.expect

const { validateAuthToken } = require('../validateAuth')
const {
  CODES,
  MESSAGES,
  AUTH_TYPE,
  STATUS_CODES,
  AUTH_TOKEN_CODE,
  AUTH_FAILED_CODE,
  UNLOGGED_IN_CODE
} = require('../../constants')

describe('validateAuth', () => {
  let headers
  const username = 'testmock'
  const cookie = `user=${username}`
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDIzMzE3MywiZXhwIjoxNTkwMjc2MzczfQ.AzfK4a1nOhkCKQhuxA0CBD2oMxSh1gb-ik4Ifasxv6A'
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'
  const invalidToken = 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'

  before(() => {
    const client = redisMock.createClient()
    Session(client)
  })

  beforeEach(() => headers = {})

  describe('validateAuthToken', () => {
    it('Should validate the auth and return an user not logged in error', async () => {
      try {
        await validateAuthToken(headers)
      } catch(err) {
        const { message, code, statusCode } = err

        expect(message)
          .to.be.equal(`${MESSAGES[AUTH_FAILED_CODE]}: ${MESSAGES[UNLOGGED_IN_CODE]}`)

        expect(code)
          .to.be.equal(CODES[AUTH_TYPE][AUTH_FAILED_CODE])

        expect(statusCode)
          .to.be.equal(STATUS_CODES[AUTH_FAILED_CODE])
      }
    })

    it('Should validate the auth and return an invalid tokenn error', async () => {
      headers = { cookie }
      Session.initUserSession(username, invalidToken)

      try {
        await validateAuthToken(headers)
      } catch(err) {
        const { message, code, statusCode } = err

        expect(message)
          .to.be.equal(`${MESSAGES[AUTH_FAILED_CODE]}: ${MESSAGES[AUTH_TOKEN_CODE]}: invalid token`)

        expect(code)
          .to.be.equal(CODES[AUTH_TYPE][AUTH_FAILED_CODE])

        expect(statusCode)
          .to.be.equal(STATUS_CODES[AUTH_FAILED_CODE])
      }
    })

    it('Should validate the auth and return an expired token error', async () => {
      headers = { cookie }
      Session.initUserSession(username, expiredToken)

      try {
        await validateAuthToken(headers)
      } catch(err) {
        const { message, code, statusCode } = err

        expect(message)
          .to.be.equal(`${MESSAGES[AUTH_FAILED_CODE]}: ${MESSAGES[AUTH_TOKEN_CODE]}: jwt expired`)

        expect(code)
          .to.be.equal(CODES[AUTH_TYPE][AUTH_FAILED_CODE])

        expect(statusCode)
          .to.be.equal(STATUS_CODES[AUTH_FAILED_CODE])
      }
    })

    it('Should validate the auth, not return any error, and return the decoded values', async () => {
      headers = { cookie }
      Session.initUserSession(username, authToken)

      const decoded = await validateAuthToken(headers)

      expect(decoded)
        .to.have.all.keys('id', 'email', 'channel', 'username', 'iat')

      expect(decoded)
        .to.includes({ id: 6 })

      expect(decoded)
        .to.includes({ email: 'testmock@test.com' })

      expect(decoded)
        .to.includes({ channel: 'user:testmock' })

      expect(decoded)
        .to.includes({ username: 'testmock' })
    })
  })
})
