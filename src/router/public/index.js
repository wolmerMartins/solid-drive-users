'use strict'

const express = require('express')
const router = express.Router()

const reenableRouter = require('./reenableRoutes')

const routerLogger = require('../logger')
const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')
const validateBody = require('../../middlewares/validateBody')
const validateLoginBody = require('../../middlewares/validateLoginBody')
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

router.use(reenableRouter)

router.post('/', validateBody, async (req, res) => {
  const { body } = req
  const { locals: { channel } } = res

  pushpin.sign.realtime({ res, channel })

  userController.create(body, channel)
})

router.post('/login', validateLoginBody, async (req, res) => {
  const { locals: { user, channel } } = res

  res.cookie(COOKIE_KEY, user.username)
  pushpin.sign.response({ res, channel })

  userController.login(user, channel)
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
