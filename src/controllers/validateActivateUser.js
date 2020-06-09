'use strict'

const model = require('../models/User')
const { verifyToken } = require('./jwt')
const validationErrorSchema = require('./validationErrorSchema')

const UserError = require('../UserError')
const {
  ACTIVE_ALREADY,
  ACTIVATION_TYPE,
  ACTIVATE_USER_CODE
} = require('../constants')

const shouldActivateUser = async id => {
  const user = await model.findUser({ id })

  if (user.isActive) {
    const { code, message } = validationErrorSchema(ACTIVATION_TYPE, ACTIVATE_USER_CODE, id, ACTIVE_ALREADY)

    throw new UserError(message, code)
  }

  return user
}

const validateActivationToken = async token => {
  try {
    const decoded = await verifyToken(token)

    return decoded
  } catch(error) {
    const { code, message } = validationErrorSchema(ACTIVATION_TYPE, ACTIVATE_USER_CODE, error.message)

    throw new UserError(message, code)
  }
}

exports.validateActivationToken = validateActivationToken
exports.shouldActivateUser = shouldActivateUser
