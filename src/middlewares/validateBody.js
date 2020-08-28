'use strict'

const middlewareLogger = require('./logger')
const { getChannel } = require('../controllers/pushpin')
const {
  validateEmail,
  validateUsername,
  validatePassword,
  validateUserRequiredFields
} = require('../validators/validateUser')

const logger = middlewareLogger.child({ module: 'validateBody' })

const validateBody = async (req, res, next) => {
  const { body, params: { id } } = req

  try {
    if (!id) validateUserRequiredFields(body)
    await validateUsername(body)
    await validateEmail(body)
    validatePassword(body)

    if (!id) {
      const { username } = body
      res.locals.channel = getChannel({ channelName: username, realtime: true })
    }

    next()
  } catch(error) {
    logger.error({ error }, 'Validate body error')

    const { message, code, statusCode } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = validateBody
