'use strict'

const express = require('express')
const router = express.Router()

const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')
const validateReenableUser = require('../../middlewares/validateReenableUser')

router.post('/reenable', validateReenableUser, (req, res) => {
  const { locals: { channel, user } } = res

  pushpin.sign.realtime({ channel, res })

  userController.reenableEmail({ user, channel })
})

router.get('/:id/reenable/:token', validateReenableUser, async (req, res) => {
  const { locals: { user, channel } } = res

  pushpin.sign.response({
    message: 'Reenable user token received',
    channel,
    res
  })

  userController.reenable({ user, channel })
})

module.exports = router
