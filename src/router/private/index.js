'use strict'

const express = require('express')
const router = express.Router()

const pushpin = require('../../controllers/pushpin')
const userController = require('../../controllers/user')

router.put('/:id', (req, res) => {
  const { locals: { channel } } = res
  const { body, params: { id } } = req

  pushpin.sign.response({ res, channel })

  userController.update({ id, body, channel })
})

module.exports = router
