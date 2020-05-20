'use strict'

const testConfig = require('./testConfig')
const {
  TEST,
  ENV_PREFIX
} = require('../constants')

const getValueFromEnv = key => {
  const { env: { NODE_ENV } } = process
  const prefix = ENV_PREFIX[NODE_ENV]

  if (NODE_ENV === TEST) return testConfig[`${prefix}${key}`]

  return process.env[`${prefix}${key}`]
}

const config = {
  app: {
    port: getValueFromEnv('PORT')
  },
  pushpin: {
    publishUrl: getValueFromEnv('PUSHPIN_PUBLISH')
  },
  db: {
    database: getValueFromEnv('DB_NAME'),
    user: getValueFromEnv('DB_USER'),
    password: getValueFromEnv('DB_PASSWORD'),
    host: getValueFromEnv('DB_HOST'),
    dialect: 'mysql'
  },
  redis: {
    db: getValueFromEnv('REDIS_DB'),
    host: getValueFromEnv('REDIS_HOST'),
    port: getValueFromEnv('REDIS_PORT')
  },
  jwt: {
    secret: getValueFromEnv('JWT_SECRET')
  }
}

module.exports = config
