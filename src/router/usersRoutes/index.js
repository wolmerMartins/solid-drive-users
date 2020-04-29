'use strict'

const express = require('express')
const router = express.Router()

const pushpin = require('../../controllers/pushpin')
const validateUser = require('../../controllers/validateUser')

router.post('/', async (req, res) => {
  const { body } = req

  try {
    await validateUser(body)
  } catch(err) {
    const { message, code, statusCode } = err

    return res.status(statusCode ?? 400).json({ message, code })
  }

  const { username } = body

  const channel = pushpin.getChannel({ channelName: username })

  pushpin.sign.response({ res, channel })

  pushpin.publish.response({
    data: { hello: 'from user route', using: 'pushpin' },
    channel
  })
})

module.exports = router
