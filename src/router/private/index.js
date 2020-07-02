'use strict'

const express = require('express')
const router = express.Router()

const verifyUser = require('../../middlewares/verifyUser')

const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')

const { COOKIE_KEY } = require('../../constants')

router.put('/:id', verifyUser, (req, res) => {
  const { body } = req
  const { locals: { user, channel } } = res

  pushpin.sign.response({ res, channel })

  userController.update({ user, body, channel })
})

router.delete('/:id', verifyUser, (req, res) => {
  const { locals: { user, channel } } = res

  pushpin.sign.response({ res, channel })

  userController.delete({ user, channel })
})

router.post('/logout', verifyUser, (req, res) => {
  const { locals: { user, channel } } = res

  res.clearCookie(COOKIE_KEY)

  pushpin.sign.response({ res, channel })

  userController.logout({ user, channel })
})

module.exports = router
