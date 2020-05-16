'use strict'

const express = require('express')
const router = express.Router()

const routerLogger = require('../logger')
const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')
const {
  validateUserRequiredFields,
  validateUsername,
  validateEmail,
  validatePassword
} = require('../../controllers/validateUser')
const {
  checkIfUserExists,
  checkIfPasswordMatch,
  validateLoginRequiredParameters
} = require('../../controllers/validateLogin')

const logger = routerLogger.child({ module: 'public' })

const errorResponse = ({ res, error }) => {
  const { message, code, statusCode } = error

  res.status(statusCode ?? 400).json({ message, code })
}

const signToPushpin = ({ res, channelName }) => {
  const channel = pushpin.getChannel({ channelName })

  pushpin.sign.response({ res, channel })

  return channel
}

router.post('/', async (req, res) => {
  const { body } = req

  try {
    validateUserRequiredFields(body)
    await validateUsername(body)
    await validateEmail(body)
    validatePassword(body)

    const { username } = body

    const channel = signToPushpin({ res, channelName: username })

    userController.create(body, channel)
  } catch(error) {
    logger.error({ error }, 'An error has occurred on create user')

    errorResponse({ res, error })
  }
})

router.post('/auth', async (req, res) => {
  const { body } = req

  try {
    validateLoginRequiredParameters(body)
    const user = await checkIfUserExists(body)
    checkIfPasswordMatch({ body, user })

    const { login } = body

    const channel = signToPushpin({ res, channelName: login })

    userController.auth(user, channel)
  } catch(error) {
    logger.error({ error }, 'An error has occurred on auth user')

    errorResponse({ res, error })
  }
})

module.exports = router
