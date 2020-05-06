'use strict'

const pushpin = require('./pushpin')
const model = require('../models/User')
const { hashPassword } = require('./password')

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
