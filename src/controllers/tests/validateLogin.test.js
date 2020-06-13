'use strict'

const chai = require('chai')
const SequelizeMock = require('sequelize-mock')

const userModel = require('../../models/User')
const { hashPassword } = require('../password')
const {
  checkIfUserExists,
  checkIfUserIsActive,
  checkIfPasswordMatch,
  validateLoginRequiredParameters
} = require('../validateLogin')
const {
  CODES,
  MESSAGES,
  LOGIN_TYPE,
  DONT_MATCH,
  NOT_ACTIVE,
  NOT_FOUND_CODE,
  LOGIN_FAILED_CODE,
  MISSING_PARAMETER_CODE
} = require('../../constants')

const expect = chai.expect
const dbMock = new SequelizeMock()

const username = 'validatelogin'
const email = 'validatelogin@test.com'
const password = 'test#$1234'
const passwordFailed = '#$1234test'
const hash = hashPassword({ password })

const UserMock = dbMock.define('User', {
  email,
  username,
  password: hash
}, {
  tableName: 'users',
  raw: true
})
const sequelizeMock = {
  define: () => UserMock
}

const returnNull = function() {
  return null
}

let body
let findOne

describe('validateLogin', () => {
  before(() => userModel(sequelizeMock))

  beforeEach(() => {
    body = { login: username, password }
    findOne = UserMock.findOne
  })

  afterEach(() => {
    UserMock.findOne = findOne
  })

  describe('validateLoginRequiredParameters', () => {
    it('Should validate the body payload and throw a login required paramenter error', () => {
      delete body.login

      try {
        validateLoginRequiredParameters(body)
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[MISSING_PARAMETER_CODE]}: login`)

        expect(code)
          .to.equal(CODES[LOGIN_TYPE][MISSING_PARAMETER_CODE])
      }
    })
  })

  describe('checkIfUserExists', () => {
    it('Should validate if the user exists with the username and throw a not found error', async () => {
      UserMock.findOne = returnNull

      try {
        await checkIfUserExists(body)
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(404)

        expect(message)
          .to.equal(`${MESSAGES[NOT_FOUND_CODE]}: User: username: ${body.login}`)

        expect(code)
          .to.equal(CODES[LOGIN_TYPE][NOT_FOUND_CODE])
      }
    })

    it('Should validate if the user exists with the email and throw a not found error', async () => {
      UserMock.findOne = returnNull
      body = {
        ...body,
        login: email
      }

      try {
        await checkIfUserExists(body)
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(404)

        expect(message)
          .to.equal(`${MESSAGES[NOT_FOUND_CODE]}: User: email: ${body.login}`)

        expect(code)
          .to.equal(CODES[LOGIN_TYPE][NOT_FOUND_CODE])
      }
    })

    it('Should validate if the user exists and return his data', async () => {
      const user = await checkIfUserExists(body)

      expect(user.dataValues)
        .to.have.property('id')

      expect(user.dataValues)
        .to.have.property('createdAt')

      expect(user.dataValues)
        .to.have.property('updatedAt')

      expect(user.dataValues)
        .to.includes({ username: body.login, password: hash })
    })
  })

  describe('checkIfPasswordMatch', () => {
    it('Should validate if the password match and throws an authentication failed error', async () => {
      body = {
        ...body,
        password: passwordFailed
      }

      try {
        const user = await UserMock.findOne()
        checkIfPasswordMatch({ body, user })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(401)

        expect(message)
          .to.equal(`${MESSAGES[LOGIN_FAILED_CODE]}: ${MESSAGES[DONT_MATCH]}`)

        expect(code)
          .to.equal(CODES[LOGIN_TYPE][DONT_MATCH])
      }
    })
  })

  describe('checkIfUserIsActive', () => {
    it('Should check if the user is active and throw an inactive error', () => {
      try {
        checkIfUserIsActive({ isActive: 0 })
      } catch(err) {
        expect(err)
          .to.have.property('statusCode', 401)

        expect(err)
          .to.have.property('message', `${MESSAGES[LOGIN_FAILED_CODE]}: ${MESSAGES[NOT_ACTIVE]}`)

        expect(err)
          .to.have.property('code', CODES[LOGIN_TYPE][NOT_ACTIVE])
      }
    })
  })
})
