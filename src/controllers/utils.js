'use strict'

const {
  AT_SYMBOL,
  EMAIL_FIELD,
  USERNAME_FIELD
} = require('../constants')

const getUserKeyFromLogin = ({ login }) => {
  if (login.includes(AT_SYMBOL)) return { [EMAIL_FIELD]: login }
  return { [USERNAME_FIELD]: login }
}

exports.getUserKeyFromLogin = getUserKeyFromLogin
