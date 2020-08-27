'use strict'

const express = require('express')
const router = express.Router()

const routerLogger = require('../logger')

const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')
const {
  shouldReenableUser,
  validateReenableUserToken,
  validateReenableUserRequiredParameters
} = require('../../validators/validateReenableUser')

const {
  MESSAGES,
  ERROR_HAS_OCCURRED,
} = require('../../constants')

const logger = routerLogger.child({ module: 'reenableRoutes' })

router.post('/reenable', (req, res) => {
  const { body } = req

  try {
    validateReenableUserRequiredParameters(body)

    const { username } = body

    const channel = pushpin.getChannel({ channelName: username, realtime: true })
    pushpin.sign.realtime({
      channel,
      res
    })

    userController.reenableEmail({ username, channel })
  } catch(error) {
    logger.error({ error }, `${MESSAGES[ERROR_HAS_OCCURRED]} receiving reenable user solicitation`)

    const { statusCode, message, code } = error

    res.status(statusCode ?? 400).json({ message, code })
  }
})

router.get('/:id/reenable/:token', async (req, res) => {
  const { params: { id, token } } = req

  try {
    const user = await shouldReenableUser({ id })
    const decoded = await validateReenableUserToken(token)
    const channel = decoded.channel.replace('rt:', '')

    pushpin.sign.response({
      message: 'Reenable user token received',
      channel,
      res
    })

    userController.reenable({ user, channel })
  } catch(error) {
    logger.error({ error }, `${MESSAGES[ERROR_HAS_OCCURRED]} reenable user`)
  }
})

module.exports = router
