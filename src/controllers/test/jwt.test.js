'use strict'

const chai = require('chai')
const expect = chai.expect

const { generateToken, verifyToken } = require('../jwt')

describe('jwt', () => {
  const id = 6
  const username = 'testmock'
  const channel = 'user:testmock'
  const email = 'testmock@test.com'
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDIzMzE3MywiZXhwIjoxNTkwMjc2MzczfQ.AzfK4a1nOhkCKQhuxA0CBD2oMxSh1gb-ik4Ifasxv6A'
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'
  const invalidToken = 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'
  const invalidSignature = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IUL-OM8is'

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

  describe('verifyToken', () => {
    it('Should verify the auth token and return him decoded', async () => {
      const decoded = await verifyToken(authToken)

      expect(decoded)
        .to.have.all.keys(['id', 'email', 'channel', 'username', 'iat'])

      expect(decoded)
        .to.have.property('id', id)

      expect(decoded)
        .to.have.property('username', username)
    })

    it('Should verify the auth token and return an invalid token error', async () => {
      try {
        await verifyToken(invalidToken)
      } catch(err) {
        const { message } = err

        expect(message)
          .to.be.equal('invalid token')
      }
    })

    it('Should verify the auth token and return an expired token error', async () => {
      try {
        await verifyToken(expiredToken)
      } catch(err) {
        const { message } = err

        expect(message)
          .to.be.equal('jwt expired')
      }
    })

    it('Should verify the auth token and return an invalid signature error', async () => {
      try {
        await verifyToken(invalidSignature)
      } catch(err) {
        const { message } = err

        expect(message)
          .to.be.equal('invalid signature')
      }
    })
  })
})
