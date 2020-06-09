'use strict'

const chai = require('chai')
const SequelizeMock = require('sequelize-mock')

const expect = chai.expect
const dbMock = new SequelizeMock()

const userModel = require('../../models/User')
const { hashPassword } = require('../password')
const {
  shouldActivateUser,
  validateActivationToken
} = require('../validateActivateUser')
const {
  CODES,
  MESSAGES,
  ACTIVE_ALREADY,
  ACTIVATION_TYPE,
  ACTIVATE_USER_CODE
} = require('../../constants')

const username = 'test.mock'
const email = 'test.mock@test.com'
const basePassword = 'test123mock@#'
const password = hashPassword({ password: basePassword })
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDIzMzE3MywiZXhwIjoxNTkwMjc2MzczfQ.AzfK4a1nOhkCKQhuxA0CBD2oMxSh1gb-ik4Ifasxv6A'
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'
const invalidToken = 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'

const UserMock = dbMock.define('User', {}, {
  autoQueryFallback: false,
  tableName: 'users',
  raw: true
})
const sequelizeMock = {
  define: () => UserMock
}

describe('validateActivateUser', () => {
  before(() => userModel(sequelizeMock))

  afterEach(() => {
    UserMock.$clearQueue()
  })

  describe('shouldActivateUser', () => {
    it('Should validate if the user is activate already and thorw an error', async () => {
      UserMock.$queueResult(UserMock.build({
        id: 3,
        email,
        username,
        password,
        isActive: true
      }))

      try {
        await shouldActivateUser(3)
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 422)

        expect(err)
          .to.have.property('message', `${MESSAGES[ACTIVATE_USER_CODE]}: User ID: 3 ${MESSAGES[ACTIVE_ALREADY]}`)

        expect(err)
          .to.have.property('code', CODES[ACTIVATION_TYPE][ACTIVATE_USER_CODE])
      }
    })

    it('Should validate if the user is activate already and return his data', async () => {
      UserMock.$queueResult(UserMock.build({
        id: 3,
        email,
        username,
        password,
        isActive: false
      }))

      const user = await shouldActivateUser(3)

      expect(user)
        .to.have.property('isActive', false)

      expect(user)
        .to.have.property('username', username)

      expect(user)
        .to.have.property('id', 3)
    })
  })

  describe('validateActivationToken', () => {
    it('Should validate the activation token and throw an expired token error', async () => {
      try {
        await validateActivationToken(expiredToken)
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 422)

        expect(err)
          .to.have.property('message', `${MESSAGES[ACTIVATE_USER_CODE]}: jwt expired`)

        expect(err)
          .to.have.property('code', CODES[ACTIVATION_TYPE][ACTIVATE_USER_CODE])
      }
    })

    it('Should validate the activation token and throw an invalid token error', async () => {
      try {
        await validateActivationToken(invalidToken)
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 422)

        expect(err)
          .to.have.property('message', `${MESSAGES[ACTIVATE_USER_CODE]}: invalid token`)

        expect(err)
          .to.have.property('code', CODES[ACTIVATION_TYPE][ACTIVATE_USER_CODE])
      }
    })

    it('Should validate the activation token and return him decoded', async () => {
      const decoded = await validateActivationToken(authToken)

      expect(decoded)
        .to.have.property('id', 6)

      expect(decoded)
        .to.have.property('username', 'testmock')
    })
  })
})
