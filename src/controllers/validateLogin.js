'use strict'

const model = require('../models/User')
const UserError = require('../UserError')
const { verifyPassword } = require('./password')
const { getUserKey, hasDifference } = require('./utils')
const validationErrorSchema = require('./validationErrorSchema')
const {
  LOGIN_TYPE,
  DONT_MATCH,
  NOT_ACTIVE,
  STATUS_CODES,
  DISABLED_USER,
  NOT_FOUND_CODE,
  LOGIN_FAILED_CODE,
  MISSING_PARAMETER_CODE,
  LOGIN_REQUIRED_PARAMETERS
} = require('../constants')

const checkIfUserIsNotDisabled = ({ isDisabled }) => {
  if (isDisabled) {
    const {
      code,
      message,
    } = validationErrorSchema(LOGIN_TYPE, LOGIN_FAILED_CODE, null, DISABLED_USER)

    throw new UserError(message, code, STATUS_CODES[LOGIN_FAILED_CODE])
  }
}

const checkIfUserIsActive = ({ isActive }) => {
  if (!isActive) {
    const {
      code,
      message
    } = validationErrorSchema(LOGIN_TYPE, LOGIN_FAILED_CODE, null, NOT_ACTIVE)

    throw new UserError(message, code, STATUS_CODES[LOGIN_FAILED_CODE])
  }
}

const checkIfPasswordMatch = ({ body, user }) => {
  if (!verifyPassword({ user, body })) {
    const {
      code,
      message
    } = validationErrorSchema(LOGIN_TYPE, LOGIN_FAILED_CODE, null, DONT_MATCH)

    throw new UserError(message, code, STATUS_CODES[LOGIN_FAILED_CODE])
  }
}

const checkIfUserExists = async (body, withPassword) => {
  const where = getUserKey(body)
  const user = await model.findUser(where, withPassword)

  if (!user) {
    const { code, message } = validationErrorSchema(LOGIN_TYPE, NOT_FOUND_CODE, where)

    throw new UserError(message, code, STATUS_CODES[NOT_FOUND_CODE])
  }

  return user
}

const validateLoginRequiredParameters = body => {
  const difference = hasDifference({ body, required: LOGIN_REQUIRED_PARAMETERS })

  if (difference.length) {
    const { code, message } = validationErrorSchema(LOGIN_TYPE, MISSING_PARAMETER_CODE, difference)

    throw new UserError(message, code)
  }
}

exports.validateLoginRequiredParameters = validateLoginRequiredParameters
exports.checkIfUserExists = checkIfUserExists
exports.checkIfPasswordMatch = checkIfPasswordMatch
exports.checkIfUserIsActive = checkIfUserIsActive
exports.checkIfUserIsNotDisabled = checkIfUserIsNotDisabled
