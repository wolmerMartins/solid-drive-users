'use strict'

const express = require('express')
const router = express.Router()

const pushpin = require('../../controllers/pushpin')

router.post('/', (req, res) => {
  const { body: { username } } = req

  if (!username) {
    return res
      .status(400)
      .json({
        message: 'Username must be informed',
        code: 'bodyValidation0',
        type: 'validation'
      })
  }

  const channel = pushpin.getChannel({ channelName: username })

  pushpin.sign.response({ res, channel })

  pushpin.publish.response({
    data: { hello: 'from user route', using: 'pushpin' },
    channel
  })
})

module.exports = router
