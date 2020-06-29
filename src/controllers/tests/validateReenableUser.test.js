'use strict'

const chai = require('chai')
const SequelizeMock = require('sequelize-mock')

const expect = chai.expect
const dbMock = new SequelizeMock()

const userModel = require('../../models/User')
const {
  shouldReenableUser,
  validateReenableUserToken,
  validateReenableUserRequiredParameters
} = require('../validateReenableUser')

const {
  CODES,
  MESSAGES,
  REENABLE_TYPE,
  ENABLED_ALREADY,
  REENABLE_USER_CODE,
  MISSING_PARAMETER_CODE
} = require('../../constants')

const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDIzMzE3MywiZXhwIjoxNTkwMjc2MzczfQ.AzfK4a1nOhkCKQhuxA0CBD2oMxSh1gb-ik4Ifasxv6A'
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'
const invalidToken = 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0bW9ja0B0ZXN0LmNvbSIsImNoYW5uZWwiOiJ1c2VyOnRlc3Rtb2NrIiwidXNlcm5hbWUiOiJ0ZXN0bW9jayIsImlhdCI6MTU5MDQwMzY5NX0.AWmsNv5otXvVQChxC62G1X_72LKS0wP2IULmk-OM8is'

const userBase = {
  id: 1,
  username: 'reenabletest',
  password: 'reenabletest',
  email: 'reenabletest@test.com'
}

const UserMock = dbMock.define('User', {}, {
  autoQueryFallback: false,
  tableName: 'users',
  raw: 'true'
})
const sequelizeMock = {
  define: () => UserMock
}

describe('validateReenableUser', () => {
  before(() => userModel(sequelizeMock))

  afterEach(() => UserMock.$clearQueue())

  describe('validateReenableUserRequiredParameters', () => {
    it('Should validate the user payload and throw a missing parameter error', () => {
      try {
        validateReenableUserRequiredParameters({})
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 422)

        expect(err)
          .to.have.property('message', `${MESSAGES[MISSING_PARAMETER_CODE]}: username`)

        expect(err)
          .to.have.property('code', CODES[REENABLE_TYPE][MISSING_PARAMETER_CODE])
      }
    })
  })

  describe('shouldReenableUser', () => {
    it('Should validate if the user is disabled and throw an user is not disabled error if not', async () => {
      UserMock.$queueResult(UserMock.build({
        ...userBase,
        isDisabled: false
      }))

      const { id } = userBase
      try {
        await shouldReenableUser(id)
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 422)

        expect(err)
          .to.have.property('message', `${MESSAGES[REENABLE_USER_CODE]}: User: ${id} ${MESSAGES[ENABLED_ALREADY]}`)

        expect(err)
          .to.have.property('code', CODES[REENABLE_TYPE][REENABLE_USER_CODE])
      }
    })

    it('Should validate if the user is disabled and return his data', async () => {
      UserMock.$queueResult(UserMock.build({
        ...userBase,
        isDisabled: true
      }))

      const { id, username } = userBase
      const user = await shouldReenableUser(id)

      expect(user)
        .to.have.property('id', id)

      expect(user)
        .to.have.property('username', username)

      expect(user)
        .to.have.property('isDisabled', true)
    })
  })

  describe('validateReenableUserToken', () => {
    it('Should validate the reenable token and throw an invalid token error', async () => {
      try {
        await validateReenableUserToken(invalidToken)
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 422)

        expect(err)
          .to.have.property('message', `${MESSAGES[REENABLE_USER_CODE]}: invalid token`)

        expect(err)
          .to.have.property('code', CODES[REENABLE_TYPE][REENABLE_USER_CODE])
      }
    })

    it('Should validate the reenable token and throw an expired token error', async () => {
      try {
        await validateReenableUserToken(expiredToken)
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 422)

        expect(err)
          .to.have.property('message', `${MESSAGES[REENABLE_USER_CODE]}: jwt expired`)

        expect(err)
          .to.have.property('code', CODES[REENABLE_TYPE][REENABLE_USER_CODE])
      }
    })

    it('Should validate the reenable token and return the user and channel data', async () => {
      const decoded = await validateReenableUserToken(authToken)

      expect(decoded)
        .to.have.property('id', 6)

      expect(decoded)
        .to.have.property('username', 'testmock')

      expect(decoded)
        .to.have.property('channel', 'user:testmock')
    })
  })
})
