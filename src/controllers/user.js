'use strict'

const _ = require('lodash')

const model = require('../models/User')
const session = require('../models/Session')

const pushpin = require('./pushpin')
const { generateToken } = require('./jwt')
const controllerLogger = require('./logger')
const { hashPassword } = require('./password')
const {
  sendReenableEmail,
  sendActivationEmail
} = require('./mailer')

const { MESSAGES, ERROR_TRYING_TO } = require('../constants')

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

      sendActivationEmail({ user, channel })

      logger.info({ user }, 'User created successfully')

      pushpin.publish.realtime({
        data: {
          success: true,
          message: 'User created successfully'
        },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} create a new User`)

      pushpin.publish.realtime({
        data: { error },
        close: true,
        channel
      })
    }
  },
  login: async (user, channel) => {
    const { id, username, email } = user

    try {
      const token = await generateToken({ id, email, channel, username }, '12h')

      await session.initUserSession(username, token)

      pushpin.publish.response({
        data: { success: true },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} log the user in`)

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
      const updatedUser = await user.update(body)

      pushpin.publish.response({
        data: { updatedUser },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} update user`)

      sendErrorResponse({ error, channel })
    }
  },
  delete: async ({ user, channel }) => {
    try {
      const deletedUser = await user.update({ isDisabled: true })

      pushpin.publish.response({
        data: {
          success: true,
          message: `User ${deletedUser.id} is disabled`
        },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} disable user`)

      sendErrorResponse({ error, channel })
    }
  },
  activate: async ({ user, channel }) => {
    try {
      const activatedUser = await user.update({ isActive: true })

      pushpin.publish.response({
        data: {
          success: true,
          message: `User ${activatedUser.id} is activated`
        },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} activate user`)

      sendErrorResponse({ error, channel })
    }
  },
  reenableEmail: ({ user, channel }) => {
    try {
      sendReenableEmail({ user, channel })

      pushpin.publish.realtime({
        data: { message: 'Reenable user solicitation received' },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} send reenable user email`)

      pushpin.publish.realtime({
        data: { error },
        close: true,
        channel
      })
    }
  },
  reenable: async ({ user, channel }) => {
    try {
      await user.update({ isDisabled: false })

      pushpin.publish.response({
        data: {
          message: `User ${user.id} is reenabled`,
          success: true
        },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} reenable user`)

      pushpin.publish.response({
        data: { error },
        channel
      })
    }
  },
  logout: async ({ user, channel }) => {
    try {
      const { username } = user

      await session.endUserSession(username)

      pushpin.publish.response({
        data: { success: true },
        channel
      })
    } catch(error) {
      logger.error({ error }, `${MESSAGES[ERROR_TRYING_TO]} logout user`)

      pushpin.publish.response({
        data: { error },
        channel
      })
    }
  }
}

module.exports = userController
