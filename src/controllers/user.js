'use strict'

const pushpin = require('./pushpin')
const model = require('../models/User')
const controllerLogger = require('./logger')
const { hashPassword } = require('./password')

const logger = controllerLogger.child({ module: 'user' })

const userController = {
  create: async (body, channel) => {
    const password = hashPassword(body)
    const userData = {
      ...body,
      password
    }

    try {
      const user = await model.createUser(userData)

      logger.info({ user }, 'User created successfully')

      pushpin.publish.response({
        data: { user, using: 'pushpin' },
        channel
      })
    } catch(error) {
      logger.error({ error }, 'An error has occurred trying to create a new User')

      pushpin.publish.response({
        data: { error, using: 'pushpin' },
        channel
      })
    }
  }
}

module.exports = userController
