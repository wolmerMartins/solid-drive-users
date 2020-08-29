'use strict'

const middlewareLogger = require('./logger')
const {
  shouldActivateUser,
  validateActivationToken
} = require('../validators/validateActivateUser')

const logger = middlewareLogger.child({ module: 'validateActivation' })

const validateActivation = async (req, res, next) => {
  const { params: { id, token } } = req

  try {
    const user = await shouldActivateUser(id)
    const decoded = await validateActivationToken(token)
    const channel = decoded.channel.replace('rt:', '')

    res.locals.user = user
    res.locals.channel = channel

    next()
  } catch(error) {
    logger.error({ error }, 'Validate activation error')

    const { message, code, statusCode } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = validateActivation
