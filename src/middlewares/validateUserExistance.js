'use strict'

const middlewareLogger = require('./logger')

const { checkIfUserExists } = require('../validators/validateLogin')

const logger = middlewareLogger.child({ module: 'validateUserExistance' })

const validateUserExistance = async (req, res, next) => {
  const { params: { username } } = req

  try {
    await checkIfUserExists({ login: username })

    next()
  } catch(error) {
    logger.error({ error }, 'Validate user existance error')

    const { message, code, statusCode } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = validateUserExistance
