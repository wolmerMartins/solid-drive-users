'use strict'

const middlewareLogger = require('./logger')
const { getCookies } = require('../controllers/utils')
const { verifyUserAuth } = require('../controllers/validateAuth')
const { checkIfUserExists } = require('../controllers/validateLogin')

const { COOKIE_KEY } = require('../constants')

const logger = middlewareLogger.child({ module: 'verifyUser' })

const verifyUser = async (req, res, next) => {
  const { locals: { channel } } = res
  const { headers, params: { id } } = req

  const cookies = getCookies(headers)
  const username = cookies.get(COOKIE_KEY)

  const body = id ? { id } : { login: username }

  try {
    const user = await checkIfUserExists(body)

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
