'use strict'

const crypto = require('crypto')

const pushpin = require('./pushpin')
const model = require('../models/User')

const hashPassword = ({ password }) => {
  const salt = crypto.randomBytes(16).toString('base64')
  const hash = crypto.createHmac('sha512', salt).update(password).digest('base64')

  return `${salt}$${hash}`
}

const userController = {
  create: async (body, channel) => {
    const password = hashPassword(body)
    const userData = {
      ...body,
      password
    }

    try {
      const user = await model.createUser(userData)

      pushpin.publish.response({
        data: { user, using: 'pushpin' },
        channel
      })
    } catch(error) {
      pushpin.publish.response({
        data: { error, using: 'pushpin' },
        channel
      })
    }
  }
}

module.exports = userController
