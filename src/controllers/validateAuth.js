'use strict'

const UserError = require('../UserError')
const Session = require('../models/Session')
const validationErrorSchema = require('./validationErrorSchema')
const { getCookies } = require('./utils')
const { verifyToken } = require('./jwt')
const {
  AUTH_TYPE,
  STATUS_CODES,
  AUTH_TOKEN_CODE,
  AUTH_FAILED_CODE,
  UNLOGGED_IN_CODE
} = require('../constants')

const userNotLoggedIn = () => {
  const { message, code } = validationErrorSchema(AUTH_TYPE, AUTH_FAILED_CODE, null, UNLOGGED_IN_CODE)

  throw new UserError(message, code, STATUS_CODES[AUTH_FAILED_CODE])
}

const verifyUser = (username, user) => {
  if (username !== user.username) {
    return userNotLoggedIn()
  }
}

const validateAuthToken = async headers => {
  const cookies = getCookies(headers)
  const username = cookies.get('user')

  if (!username) return userNotLoggedIn()

  try {
    const token = await Session.getUserSessionToken(username)
    const decoded = await verifyToken(token)
    verifyUser(username, decoded)
  } catch(err) {
    const { message, code } = validationErrorSchema(AUTH_TYPE, AUTH_FAILED_CODE, err.message, AUTH_TOKEN_CODE)

    throw new UserError(message, code, STATUS_CODES[AUTH_FAILED_CODE])
  }
}

exports.validateAuthToken = validateAuthToken
