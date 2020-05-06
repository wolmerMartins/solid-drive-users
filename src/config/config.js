'use strict'

require('custom-env').env(true)

const {
  PORT,
  DB_NAME,
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  PUSHPIN_PUBLISH
} = process.env

const config = {
  app: {
    port: PORT
  },
  pushpin: {
    publishUrl: PUSHPIN_PUBLISH
  },
  db: {
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    dialect: 'mysql'
  }
}

module.exports = config
