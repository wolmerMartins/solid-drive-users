'use strict'

const express = require('express')
const router = express.Router()

const reenableRouter = require('./reenableRoutes')

const routerLogger = require('../logger')
const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')
const validateBody = require('../../middlewares/validateBody')
const {
  checkIfUserExists,
  checkIfUserIsActive,
  checkIfPasswordMatch,
  checkIfUserIsNotDisabled,
  validateLoginRequiredParameters
} = require('../../validators/validateLogin')
const {
  shouldActivateUser,
  validateActivationToken
} = require('../../validators/validateActivateUser')

const {
  MESSAGES,
  COOKIE_KEY,
  ERROR_HAS_OCCURRED
} = require('../../constants')

const logger = routerLogger.child({ module: 'public' })

const errorResponse = ({ res, error }) => {
  const { message, code, statusCode } = error

  res.status(statusCode ?? 400).json({ message, code })
}

const signToPushpin = ({ res, channelName, realtime }) => {
  const channel = pushpin.getChannel({ channelName, realtime })

  if (realtime) {
    pushpin.sign.realtime({ res, channel })
  } else {
    pushpin.sign.response({ res, channel })
  }

  return channel
}

router.use(reenableRouter)

router.post('/', validateBody, async (req, res) => {
  const { body } = req
  const { locals: { channel } } = res

  pushpin.sign.realtime({ res, channel })

  userController.create(body, channel)
})

router.post('/login', async (req, res) => {
  const { body } = req

  try {
    validateLoginRequiredParameters(body)
    const user = await checkIfUserExists(body, true)
    checkIfUserIsActive(user)
    checkIfUserIsNotDisabled(user)
    checkIfPasswordMatch({ body, user })

    const { login } = body

    res.cookie(COOKIE_KEY, user.username)
    const channel = signToPushpin({ res, channelName: login })

    userController.login(user, channel)
  } catch(error) {
    logger.error({ error }, `${MESSAGES[ERROR_HAS_OCCURRED]} login user`)

    errorResponse({ res, error })
  }
})

router.get('/:id/activate/:token', async (req, res) => {
  const { params: { id, token } } = req

  try {
    const user = await shouldActivateUser(id)
    const decoded = await validateActivationToken(token)
    const channel = decoded.channel.replace('rt:', '')

    pushpin.sign.response({
      res,
      channel,
      message: `Received activation token for user id: ${id}`
    })

    userController.activate({ user, channel })
  } catch(error) {
    logger.error({ error }, `${MESSAGES[ERROR_HAS_OCCURRED]} activate user`)

    errorResponse({ res, error })
  }
})

module.exports = router
