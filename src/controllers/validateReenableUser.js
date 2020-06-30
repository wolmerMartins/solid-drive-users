'use strict'

const model = require('../models/User')
const { verifyToken } = require('./jwt')
const { hasDifference } = require('./utils')
const validationErrorSchema = require('./validationErrorSchema')

const UserError = require('../UserError')
const {
  REENABLE_TYPE,
  ENABLED_ALREADY,
  REENABLE_USER_CODE,
  MISSING_PARAMETER_CODE,
  REENABLE_REQUIRED_PARAMETERS
} = require('../constants')

const validateReenableUserToken = async token => {
  try {
    const decoded = await verifyToken(token)

    return decoded
  } catch(error) {
    const { code, message } = validationErrorSchema(REENABLE_TYPE, REENABLE_USER_CODE, error.message)

    throw new UserError(message, code)
  }
}

const shouldReenableUser = async where => {
  const user = await model.findUser(where)
  const { id, username } = where

  if (!user.isDisabled) {
    const { message, code } = validationErrorSchema(REENABLE_TYPE, REENABLE_USER_CODE, id ?? username, ENABLED_ALREADY)

    throw new UserError(message, code)
  }

  return user
}

const validateReenableUserRequiredParameters = body => {
  const difference = hasDifference({ body, required: REENABLE_REQUIRED_PARAMETERS })

  if (difference.length) {
    const { message, code } = validationErrorSchema(REENABLE_TYPE, MISSING_PARAMETER_CODE, difference)

    throw new UserError(message, code)
  }
}

exports.validateReenableUserRequiredParameters = validateReenableUserRequiredParameters
exports.shouldReenableUser = shouldReenableUser
exports.validateReenableUserToken = validateReenableUserToken
