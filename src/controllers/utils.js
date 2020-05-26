'use strict'

const {
  AT_SYMBOL,
  EMAIL_FIELD,
  USERNAME_FIELD
} = require('../constants')

const getCookies = ({ cookie }) => {
  const cookiesObj = new Map()
  if (!cookie) return cookiesObj

  const cookies = cookie.split('; ')
  const cookiesLimit = cookies.length

  for (let ck = 0; ck < cookiesLimit; ck++) {
    const [key, value] = cookies[ck].split('=')
    cookiesObj.set(key, value)
  }

  return cookiesObj
}

const getUserKeyFromLogin = ({ login }) => {
  if (login.includes(AT_SYMBOL)) return { [EMAIL_FIELD]: login }
  return { [USERNAME_FIELD]: login }
}

exports.getUserKeyFromLogin = getUserKeyFromLogin
exports.getCookies = getCookies
