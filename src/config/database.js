'use strict'

const { Sequelize } = require('sequelize')

const model = require('../models/User')

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
    model(sequelize)
    console.log('Database connection has been established successfully.')
  } catch(err) {
    console.log('Unable to connect to the database:', err)
  }
}

module.exports = setup
