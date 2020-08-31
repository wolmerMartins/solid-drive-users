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

  try {
    if (id && token) {
      const user = await shouldReenableUser({ id })
      const decoded = await validateReenableUserToken(token)
      const channel = decoded.channel.replace('rt:', '')

      res.locals.user = user
      res.locals.channel = channel
    } else {
      validateReenableUserRequiredParameters(body)

      const { username } = body
      res.locals.username = username
      res.locals.channel = getChannel({ channelName: username, realtime: true })
    }

    next()
  } catch(error) {
    logger.error({ error }, 'Validate reenable user error')

    const { message, code, statusCode } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = validateReenableUser
