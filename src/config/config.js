'use strict'

const setEnvPrefix = () => {
  const { env: { NODE_ENV } } = process
  
  if (NODE_ENV === 'production') return 'PROD_'
  if (NODE_ENV === 'development') return 'DEV_'
  return 'TST_'
}

const ENV_PREFIX = setEnvPrefix()

const getValueFromEnv = key => process.env[`${ENV_PREFIX}${key}`]

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
  }
}

module.exports = config
