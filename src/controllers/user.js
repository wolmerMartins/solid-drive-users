'use strict'

const model = require('../models/User')
const session = require('../models/Session')

const { hashPassword } = require('./password')
const controllerLogger = require('./logger')
const { generateToken } = require('./jwt')
const pushpin = require('./pushpin')

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
  },
  auth: async (user, channel) => {
    const { id, username, email } = user

    try {
      const token = await generateToken({ id, email, channel, username })

      await session.initUserSession(username, token)

      pushpin.publish.response({
        data: { success: true },
        channel
      })
    } catch(error) {
      logger.error({ error }, 'An error has occurred trying to log the user in')

      pushpin.publish.response({
        data: { error },
        channel
      })
    }
  }
}

module.exports = userController
