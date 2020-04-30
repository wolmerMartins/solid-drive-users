'use strict'

const express = require('express')
const router = express.Router()

const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')
const validateUser = require('../../controllers/validateUser')

router.post('/', async (req, res) => {
  const { body } = req

  try {
    await validateUser(body)

    const { username } = body
  
    const channel = pushpin.getChannel({ channelName: username })
  
    pushpin.sign.response({ res, channel })

    userController.create(body, channel)
  } catch(err) {
    const { message, code, statusCode } = err

    return res.status(statusCode ?? 400).json({ message, code })
  }
})

module.exports = router
