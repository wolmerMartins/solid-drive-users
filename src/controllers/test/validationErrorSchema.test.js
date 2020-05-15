'use strict'

const chai = require('chai')
const expect = chai.expect

const validationErrorSchema = require('../validationErrorSchema')

const {
  CODES,
  MESSAGES,
  USER_TYPE,
  MAX_LENGTH_CODE,
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
})
