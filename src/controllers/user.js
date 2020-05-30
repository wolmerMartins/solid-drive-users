'use strict'

const _ = require('lodash')

const model = require('../models/User')
const session = require('../models/Session')

const pushpin = require('./pushpin')
const { generateToken } = require('./jwt')
const controllerLogger = require('./logger')
const { hashPassword } = require('./password')
const {
  validateEmail,
  validateUsername,
  validatePassword
} = require('./validateUser')

const logger = controllerLogger.child({ module: 'user' })

const sendErrorResponse = ({ error, channel }) => pushpin
  .publish.response({
    data: { error },
    channel
  })

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

      sendErrorResponse({ error, channel })
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

      sendErrorResponse({ error, channel })
    }
  },
  update: async ({ user, body, channel }) => {
    if (_.isEmpty(body)) {
      pushpin.publish.response({
        data: { message: 'Cannot update user with an empty body' },
        channel
      })
    }

    try {
      await validateUsername(body)
      await validateEmail(body)
      validatePassword(body)

      const updatedUser = await user.update(body)

      pushpin.publish.response({
        data: { updatedUser },
        channel
      })
    } catch(error) {
      logger.error({ error }, 'An error has occurred trying to update user')

      sendErrorResponse({ error, channel })
    }
  },
  delete: async ({ user, channel }) => {
    try {
      const deletedUser = await user.update({ isDisabled: true })

      pushpin.publish.response({
        data: { deletedUser },
        channel
      })
    } catch(error) {
      logger.error({ error }, 'An error has occurred trying to disable user')

      sendErrorResponse({ error, channel })
    }
  }
}

module.exports = userController
