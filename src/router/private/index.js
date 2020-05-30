'use strict'

const express = require('express')
const router = express.Router()

const verifyUser = require('../../middlewares/verifyUser')

const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')

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

module.exports = router
