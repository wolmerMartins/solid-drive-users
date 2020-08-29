'use strict'

const middlewareLogger = require('./logger')
const { getChannel } = require('../controllers/pushpin')
const {
  checkIfUserExists,
  checkIfUserIsActive,
  checkIfPasswordMatch,
  checkIfUserIsNotDisabled,
  validateLoginRequiredParameters
} = require('../validators/validateLogin')

const logger = middlewareLogger.child({ module: 'validateLoginBody' })

const validateLoginBody = async (req, res, next) => {
  const { body } = req

  try {
    validateLoginRequiredParameters(body)
    const user = await checkIfUserExists(body, true)

    checkIfUserIsActive(user)
    checkIfUserIsNotDisabled(user)
    checkIfPasswordMatch({ body, user })

    const { login } = body

    res.locals.user = user
    res.locals.channel = getChannel({ channelName: login })

    next()
  } catch(error) {
    logger.error({ error }, 'Validate login error')

    const { message, code, statusCode } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = validateLoginBody
