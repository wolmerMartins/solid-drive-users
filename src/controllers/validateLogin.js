'use strict'

const model = require('../models/User')
const UserError = require('../UserError')
const { verifyPassword } = require('./password')
const { getUserKeyFromLogin } = require('./utils')
const validationErrorSchema = require('./validationErrorSchema')
const {
  LOGIN_TYPE,
  STATUS_CODES,
  NOT_FOUND_CODE,
  AUTH_FAILED_CODE,
  MISSING_PARAMETER_CODE,
  LOGIN_REQUIRED_PARAMETERS
} = require('../constants')

const checkIfPasswordMatch = ({ body, user }) => {
  if (!verifyPassword({ user, body })) {
    const {
      code,
      message
    } = validationErrorSchema(LOGIN_TYPE, AUTH_FAILED_CODE)

    throw new UserError(message, code, STATUS_CODES[AUTH_FAILED_CODE])
  }
}

const checkIfUserExists = async body => {
  const where = getUserKeyFromLogin(body)
  const user = await model.findUser(where)

  if (!user) {
    const { code, message } = validationErrorSchema(LOGIN_TYPE, NOT_FOUND_CODE, where)

    throw new UserError(message, code, STATUS_CODES[NOT_FOUND_CODE])
  }

  return user
}

const validateLoginRequiredParameters = body => {
  const difference = LOGIN_REQUIRED_PARAMETERS
    .filter(required => !Object.keys(body).includes(required))

  if (difference.length) {
    const { code, message } = validationErrorSchema(LOGIN_TYPE, MISSING_PARAMETER_CODE, difference)

    throw new UserError(message, code)
  }
}

exports.validateLoginRequiredParameters = validateLoginRequiredParameters
exports.checkIfUserExists = checkIfUserExists
exports.checkIfPasswordMatch = checkIfPasswordMatch
