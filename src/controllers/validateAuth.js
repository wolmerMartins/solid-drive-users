'use strict'

const UserError = require('../UserError')
const Session = require('../models/Session')
const validationErrorSchema = require('./validationErrorSchema')
const { getCookies } = require('./utils')
const { verifyToken } = require('./jwt')
const {
  AUTH_TYPE,
  COOKIE_KEY,
  STATUS_CODES,
  FORBIDDEN_CODE,
  AUTH_TOKEN_CODE,
  AUTH_FAILED_CODE,
  UNLOGGED_IN_CODE
} = require('../constants')

const forbiddenAccess = () => {
  const { message, code } = validationErrorSchema(AUTH_TYPE, FORBIDDEN_CODE)

  throw new UserError(message, code, STATUS_CODES[FORBIDDEN_CODE])
}

const userNotLoggedIn = () => {
  const { message, code } = validationErrorSchema(AUTH_TYPE, AUTH_FAILED_CODE, null, UNLOGGED_IN_CODE)

  throw new UserError(message, code, STATUS_CODES[AUTH_FAILED_CODE])
}

const verifyUser = (channel, user) => {
  const channelParts = channel.split(':')
  const channelUser = channelParts[channelParts.length - 1]

  if (channelUser !== user.username) {
    return forbiddenAccess()
  }
}

const validateAuthToken = async headers => {
  const cookies = getCookies(headers)
  const username = cookies.get(COOKIE_KEY)

  if (!username) return userNotLoggedIn()

  try {
    const token = await Session.getUserSessionToken(username)
    const decoded = await verifyToken(token)

    return decoded
  } catch(err) {
    const { message, code } = validationErrorSchema(AUTH_TYPE, AUTH_FAILED_CODE, err.message, AUTH_TOKEN_CODE)

    throw new UserError(message, code, STATUS_CODES[AUTH_FAILED_CODE])
  }
}

exports.validateAuthToken = validateAuthToken
exports.verifyUserAuth = verifyUser
