'use strict'

const middlewareLogger = require('./logger')
const { getChannel } = require('../controllers/pushpin')
const {
  shouldReenableUser,
  validateReenableUserToken,
  validateReenableUserRequiredParameters
} = require('../validators/validateReenableUser')

const logger = middlewareLogger.child({ module: 'validateReenableUser' })

const validateReenableUser = async (req, res, next) => {
  const { body, params: { id, token } } = req
  let where = { id }
  let channel

  try {
    if (id) {
      const decoded = await validateReenableUserToken(token)
      channel = decoded.channel.replace('rt:', '')
    } else {
      validateReenableUserRequiredParameters(body)

      const { username } = body

      where = { username }
      channel = getChannel({ channelName: username, realtime: true })
    }

    const user = await shouldReenableUser(where)

    res.locals.user = user
    res.locals.channel = channel

    next()
  } catch(error) {
    logger.error({ error }, 'Validate reenable user error')

    const { message, code, statusCode } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = validateReenableUser
