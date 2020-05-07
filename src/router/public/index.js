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

const logger = routerLogger.child({ module: 'public' })

router.post('/', async (req, res) => {
  const { body } = req

  try {
    validateUserRequiredFields(body)
    await validateUsername(body)
    await validateEmail(body)
    validatePassword(body)

    const { username } = body
  
    const channel = pushpin.getChannel({ channelName: username })
  
    pushpin.sign.response({ res, channel })

    userController.create(body, channel)
  } catch(error) {
    const { message, code, statusCode } = error

    logger.error({ error }, 'An error has occurred on /POST')

    return res.status(statusCode ?? 400).json({ message, code })
  }
})

module.exports = router
