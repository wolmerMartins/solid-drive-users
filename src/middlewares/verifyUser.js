'use strict'

const middlewareLogger = require('./logger')
const { verifyUserAuth } = require('../controllers/validateAuth')
const { checkIfUserExists } = require('../controllers/validateLogin')

const logger = middlewareLogger.child({ module: 'verifyUser' })

const verifyUser = async (req, res, next) => {
  const { params: { id } } = req
  const { locals: { channel } } = res

  try {
    const user = await checkIfUserExists({ id })

    verifyUserAuth(channel, user)

    res.locals.user = user

    next()
  } catch(error) {
    logger.error({ error }, 'An error has occurred verifing the user authenticity')

    const { statusCode, message, code } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
}

module.exports = verifyUser
