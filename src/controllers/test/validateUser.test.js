'use strict'

const chai = require('chai')
const SequelizeMock = require('sequelize-mock')

const expect = chai.expect
const dbMock = new SequelizeMock()

let user
const username = 'test'
const whiteSpaceUsername = 'test mock'
const maxLengthUsername = 'testtesttesttesttesttesttesttest'
const email = 'test@test.com'
const invalidEmail = 'test@test'
const maxLengthEmail = 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest@test.com'
const password = 'Test1234@#'
const onlyNumberPassword = '123456789'
const onlyLettersPassword = 'asdhjhsad'
const onlySpecialCharacterPassword = '!@#$%^&*('
const maxLengthPassword = 'Test1234@#Test1234@#Test1234@#'
const minLengthPassword = 'Test12@'

const UserMock = dbMock.define('User', {
  email,
  username,
  password
}, {
  autoQueryFallback: false
})
const sequelizeMock = {
  define: () => UserMock
}

const userModel = require('../../models/User')
const {
  validateUserRequiredFields,
  validateUsername,
  validateEmail,
  validatePassword
} = require('../validateUser')

userModel(sequelizeMock)

const {
  CODES,
  MESSAGES,
  USER_TYPE,
  UNIQUE_CODE,
  MAX_LENGTH_CODE,
  MIN_LENGTH_CODE,
  EMAIL_MAX_LENGTH,
  WHITE_SPACES_CODE,
  USERNAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  NOT_CONTAIN_LETTERS,
  NOT_CONTAIN_NUMBERS,
  INVALID_PARAMETER_CODE,
  MISSING_PARAMETER_CODE,
  NOT_CONTAIN_SPECIAL_CHARACTER
} = require('../../constants')

describe('validateUser', () => {
  beforeEach(() => {
    user = { email, username, password }
  })

  afterEach(() => {
    UserMock.$clearQueue()
  })

  describe('validateUserRequiredFields', () => {
    it('Should validate the user and thrown a password required parameter error', () => {
      delete user.password

      try {
        validateUserRequiredFields(user)
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[MISSING_PARAMETER_CODE]}: password`)

        expect(code)
          .to.equal(CODES[USER_TYPE][MISSING_PARAMETER_CODE])
      }
    })
  })

  describe('validateUsername', () => {
    it('Should validate the username and throws an white space error', async () => {
      try {
        await validateUsername({
          ...user,
          username: whiteSpaceUsername
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: username: ${MESSAGES[WHITE_SPACES_CODE]}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the username and throws and max length error', async () => {
      try {
        await validateUsername({
          ...user,
          username: maxLengthUsername
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: username: ${MESSAGES[MAX_LENGTH_CODE]} ${USERNAME_MAX_LENGTH}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the username and throws a not unique error', async () => {
      UserMock.$queueResult(UserMock.build(user))

      try {
        await validateUsername(user)
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: username: ${MESSAGES[UNIQUE_CODE]}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })
  })

  describe('validateEmail', () => {
    it('Should validate the email and throws an invalid email error', async () => {
      try {
        await validatePassword({
          ...user,
          email: invalidEmail
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: email`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the email and throws an email max length error', async () => {
      try {
        await validateEmail({
          ...user,
          email: maxLengthEmail
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: email: ${MESSAGES[MAX_LENGTH_CODE]} ${EMAIL_MAX_LENGTH}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the email and throws an not unique email error', async () => {
      UserMock.$queueResult(UserMock.build(user))

      try {
        await validateEmail(user)
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: email: ${MESSAGES[UNIQUE_CODE]}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })
  })

  describe('validatePassword', () => {
    it('Should validate the password and throws a max length error', () => {
      try {
        validatePassword({
          ...user,
          password: maxLengthPassword
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: password: ${MESSAGES[MAX_LENGTH_CODE]} ${PASSWORD_MAX_LENGTH}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the password and throws a min length error', () => {
      try {
        validatePassword({
          ...user,
          password: minLengthPassword
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: password: ${MESSAGES[MIN_LENGTH_CODE]} ${PASSWORD_MIN_LENGTH}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the password and throws a numbers and special characters error', () => {
      try {
        validatePassword({
          ...user,
          password: onlyLettersPassword
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: password: ${MESSAGES[NOT_CONTAIN_NUMBERS]}, ${MESSAGES[NOT_CONTAIN_SPECIAL_CHARACTER]}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the password and throws a letters and special characters error', () => {
      try {
        validatePassword({
          ...user,
          password: onlyNumberPassword
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: password: ${MESSAGES[NOT_CONTAIN_LETTERS]}, ${MESSAGES[NOT_CONTAIN_SPECIAL_CHARACTER]}`)

        expect(code)
          .to.equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])
      }
    })

    it('Should validate the password and return a letters and numbers error', () => {
      try {
        validatePassword({
          ...user,
          password: onlySpecialCharacterPassword
        })
      } catch(err) {
        const { statusCode, message, code } = err

        expect(statusCode)
          .to.equal(422)

        expect(message)
          .to.equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: password: ${MESSAGES[NOT_CONTAIN_LETTERS]}, ${MESSAGES[NOT_CONTAIN_NUMBERS]}`)
      }
    })
  })
})
