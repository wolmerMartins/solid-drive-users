'use strict'

const middlewareLogger = require('./logger')
const { validateAuthToken } = require('../controllers/validateAuth')

const logger = middlewareLogger.child({ module: 'auth' })

const auth = async (req, res, next) => {
  const { headers } = req

  try {
    await validateAuthToken(headers)

    next()
  } catch(error) {
    logger.error({ error }, 'An error has occurred trying to authenticate user')

    const { message, code, statusCode } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = auth
