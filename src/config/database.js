'use strict'

const { Sequelize } = require('sequelize')

const model = require('../models/User')
const configLogger = require('./logger')

const logger = configLogger.child({ module: 'database' })

let sequelize

const setup = async ({
  user,
  host,
  dialect,
  password,
  database
}) => {
  sequelize = new Sequelize(
    database,
    user,
    password,
    {
      host,
      dialect
    }
  )

  try {
    await sequelize.authenticate()
    await model(sequelize)
    logger.info('Database connected and user table created successfully')
  } catch(error) {
    logger.error({ error }, 'Unable to connect to the database')
  }
}

module.exports = setup
