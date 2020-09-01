'use strict'

const express = require('express')
const router = express.Router()

const reenableRouter = require('./reenableRoutes')

const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')
const validateBody = require('../../middlewares/validateBody')
const validateLoginBody = require('../../middlewares/validateLoginBody')
const validateActivation = require('../../middlewares/validateActivation')
const validateUserExistance = require('../../middlewares/validateUserExistance')

const { COOKIE_KEY } = require('../../constants')

router.use(reenableRouter)

router.get('/:username/exists', validateUserExistance, (req, res) => {
  res.status(200).json({ success: true })
})

router.post('/', validateBody, (req, res) => {
  const { body } = req
  const { locals: { channel } } = res

  pushpin.sign.realtime({ res, channel })

  userController.create(body, channel)
})

router.post('/login', validateLoginBody, (req, res) => {
  const { locals: { user, channel } } = res

  res.cookie(COOKIE_KEY, user.username)
  pushpin.sign.response({ res, channel })

  userController.login(user, channel)
})

router.get('/:id/activate/:token', validateActivation, (req, res) => {
  const { locals: { user, channel } } = res

  pushpin.sign.response({
    res,
    channel,
    message: `Received activation token for user id: ${id}`
  })

  userController.activate({ user, channel })
})

module.exports = router
