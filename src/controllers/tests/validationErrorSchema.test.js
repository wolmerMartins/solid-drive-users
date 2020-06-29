'use strict'

const chai = require('chai')
const expect = chai.expect

const validationErrorSchema = require('../validationErrorSchema')

const {
  CODES,
  MESSAGES,
  AUTH_TYPE,
  USER_TYPE,
  LOGIN_TYPE,
  DONT_MATCH,
  NOT_ACTIVE,
  REENABLE_TYPE,
  NOT_FOUND_CODE,
  FORBIDDEN_CODE,
  ACTIVE_ALREADY,
  ACTIVATION_TYPE,
  AUTH_TOKEN_CODE,
  MAX_LENGTH_CODE,
  ENABLED_ALREADY,
  AUTH_FAILED_CODE,
  LOGIN_FAILED_CODE,
  ACTIVATE_USER_CODE,
  REENABLE_USER_CODE,
  NOT_CONTAIN_LETTERS,
  NOT_CONTAIN_NUMBERS,
  MISSING_PARAMETER_CODE,
  INVALID_PARAMETER_CODE,
  NOT_CONTAIN_SPECIAL_CHARACTER
} = require('../../constants')

describe('validationErrorSchema', () => {
  const missedParameters = ['username', 'email']

  describe('missing parameter', () => {
    it('Should return a MISSING PARAMETER error message', () => {
      const { code, message } = validationErrorSchema(USER_TYPE, MISSING_PARAMETER_CODE, missedParameters)

      expect(code)
        .to
        .equal(CODES[USER_TYPE][MISSING_PARAMETER_CODE])

      expect(message)
        .to
        .equal(`${MESSAGES[MISSING_PARAMETER_CODE]}: ${missedParameters.join(', ')}`)
    })
  })

  describe('invalid parameter', () => {
    it('Should return an INVALID PARAMETER error message', () => {
      const { code, message } = validationErrorSchema(USER_TYPE, INVALID_PARAMETER_CODE, 'email')

      expect(code)
        .to
        .equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])

      expect(message)
        .to
        .equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: email`)
    })

    it('Should return an INVALID PARAMETER error message with a specific message', () => {
      const { code, message } = validationErrorSchema(USER_TYPE, INVALID_PARAMETER_CODE, 'password', NOT_CONTAIN_LETTERS)

      expect(code)
        .to
        .equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])

      expect(message)
        .to
        .equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: password: ${MESSAGES[NOT_CONTAIN_LETTERS]}`)
    })

    it('Should return an INVALID PARAMETER error message with two specific messages', () => {
      const {
        code,
        message
      } = validationErrorSchema(USER_TYPE, INVALID_PARAMETER_CODE, 'password', [NOT_CONTAIN_NUMBERS, NOT_CONTAIN_SPECIAL_CHARACTER])

      expect(code)
        .to
        .equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])

      expect(message)
        .to
        .equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: password: ${MESSAGES[NOT_CONTAIN_NUMBERS]}, ${MESSAGES[NOT_CONTAIN_SPECIAL_CHARACTER]}`)
    })

    it('Should return an INVALID PARAMETER error message with a specific message and a required parameter', () => {
      const { code, message } = validationErrorSchema(USER_TYPE, INVALID_PARAMETER_CODE, 'username', MAX_LENGTH_CODE, 30)

      expect(code)
        .to
        .equal(CODES[USER_TYPE][INVALID_PARAMETER_CODE])

      expect(message)
        .to
        .equal(`${MESSAGES[INVALID_PARAMETER_CODE]}: username: ${MESSAGES[MAX_LENGTH_CODE]} 30`)
    })
  })

  describe('not found', () => {
    it('Should return a NOT FOUND error message with username: test', () => {
      const { code, message } = validationErrorSchema(LOGIN_TYPE, NOT_FOUND_CODE, { username: 'test' })

      expect(code)
        .to.equal(CODES[LOGIN_TYPE][NOT_FOUND_CODE])

      expect(message)
        .to.equal(`${MESSAGES[NOT_FOUND_CODE]}: User: username: test`)
    })

    it('Should return a NOT FOUND error message with email: test@test.com', () => {
      const { code, message } = validationErrorSchema(LOGIN_TYPE, NOT_FOUND_CODE, { email: 'test@test.com' })

      expect(code)
        .to.equal(CODES[LOGIN_TYPE][NOT_FOUND_CODE])

      expect(message)
        .to.equal(`${MESSAGES[NOT_FOUND_CODE]}: User: email: test@test.com`)
    })

    it('Should return a NOT FOUND error message with id: 2', () => {
      const { code, message } = validationErrorSchema(LOGIN_TYPE, NOT_FOUND_CODE, { id: 2 })

      expect(code)
        .to.equal(CODES[LOGIN_TYPE][NOT_FOUND_CODE])

      expect(message)
        .to.equal(`${MESSAGES[NOT_FOUND_CODE]}: User: id: 2`)
    })
  })

  describe('login failed', () => {
    it('Should return a LOGIN FAILED error message', () => {
      const { code, message } = validationErrorSchema(LOGIN_TYPE, LOGIN_FAILED_CODE)

      expect(code)
        .to.equal(CODES[LOGIN_TYPE][LOGIN_FAILED_CODE])

      expect(message)
        .to.equal(MESSAGES[LOGIN_FAILED_CODE])
    })

    it('Should return a DONT MATCH login error message', () => {
      const { code, message } = validationErrorSchema(LOGIN_TYPE, LOGIN_FAILED_CODE, null, DONT_MATCH)

      expect(code)
        .to.equal(CODES[LOGIN_TYPE][DONT_MATCH])

      expect(message)
        .to.equal(`${MESSAGES[LOGIN_FAILED_CODE]}: ${MESSAGES[DONT_MATCH]}`)
    })

    it('Should return a NOT ACTIVE error message', () => {
      const { code, message } = validationErrorSchema(LOGIN_TYPE, LOGIN_FAILED_CODE, null, NOT_ACTIVE)

      expect(code)
        .to.equal(CODES[LOGIN_TYPE][NOT_ACTIVE])

      expect(message)
        .to.equal(`${MESSAGES[LOGIN_FAILED_CODE]}: ${MESSAGES[NOT_ACTIVE]}`)
    })
  })

  describe('auth failed', () => {
    it('Should return an AUTH FAILED error message', () => {
      const { code, message } = validationErrorSchema(AUTH_TYPE, AUTH_FAILED_CODE)

      expect(code)
        .to.equal(CODES[AUTH_TYPE][AUTH_FAILED_CODE])

      expect(message)
        .to.equal(MESSAGES[AUTH_FAILED_CODE])
    })

    it('Should return an AUTH TOKEN auth failed error message', () => {
      const { code, message } = validationErrorSchema(AUTH_TYPE, AUTH_FAILED_CODE, 'invalid token', AUTH_TOKEN_CODE)

      expect(code)
        .to.equal(CODES[AUTH_TYPE][AUTH_FAILED_CODE])

      expect(message)
        .to.equal(`${MESSAGES[AUTH_FAILED_CODE]}: ${MESSAGES[AUTH_TOKEN_CODE]}: invalid token`)
    })
  })

  describe('forbidden access', () => {
    it('Should return an FORBIDDEN REQUEST error message', () => {
      const { code, message } = validationErrorSchema(AUTH_TYPE, FORBIDDEN_CODE)

      expect(code)
        .to.equal(CODES[AUTH_TYPE][FORBIDDEN_CODE])

      expect(message)
        .to.equal(MESSAGES[FORBIDDEN_CODE])
    })
  })

  describe('activate user', () => {
    it('Should return an ACTIVE USER error message', () => {
      const { code, message } = validationErrorSchema(ACTIVATION_TYPE, ACTIVATE_USER_CODE, 'token expired')

      expect(code)
        .to.equal(CODES[ACTIVATION_TYPE][ACTIVATE_USER_CODE])

      expect(message)
        .to.equal(`${MESSAGES[ACTIVATE_USER_CODE]}: token expired`)
    })

    it('Should return an ACTIVE ALREADY error message', () => {
      const { code, message } = validationErrorSchema(ACTIVATION_TYPE, ACTIVATE_USER_CODE, 5, ACTIVE_ALREADY)

      expect(code)
        .to.equal(CODES[ACTIVATION_TYPE][ACTIVATE_USER_CODE])

      expect(message)
        .to.equal(`${MESSAGES[ACTIVATE_USER_CODE]}: User ID: 5 ${MESSAGES[ACTIVE_ALREADY]}`)
    })
  })

  describe('reenable user', () => {
    it('Should return a REENABLE USER error message', () => {
      const { code, message } = validationErrorSchema(REENABLE_TYPE, REENABLE_USER_CODE, 'token expired')

      expect(code)
        .to.equal(CODES[REENABLE_TYPE][REENABLE_USER_CODE])

      expect(message)
        .to.equal(`${MESSAGES[REENABLE_USER_CODE]}: token expired`)
    })

    it('Should return a USER ALREADY ENABLED error message', () => {
      const { code, message } = validationErrorSchema(REENABLE_TYPE, REENABLE_USER_CODE, 1, ENABLED_ALREADY)

      expect(code)
        .to.equal(CODES[REENABLE_TYPE][REENABLE_USER_CODE])

      expect(message)
        .to.equal(`${MESSAGES[REENABLE_USER_CODE]}: User: 1 ${MESSAGES[ENABLED_ALREADY]}`)
    })
  })
})
