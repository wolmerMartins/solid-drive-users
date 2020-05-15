'use strict'

const {
  CODES,
  MESSAGES,
  NOT_FOUND_CODE,
  AUTH_FAILED_CODE,
  MISSING_PARAMETER_CODE,
  INVALID_PARAMETER_CODE
} = require('../constants')

const setValues = values => {
  if (Array.isArray(values)) return values.join(', ')
  return values
}

const setMessage = (code, values) => {
  if (values && values.length) return `${MESSAGES[code]}: ${setValues(values)}`
  return MESSAGES[code]
}

const setNotFoundMessage = (code, values) => {
  const { username, email } = values
  const message = `User: ${username ? `username: ${username}` : `email: ${email}`}`

  return setMessage(code, message)
}

const setRequiredMessage = messageCode => {
  if (Array.isArray(messageCode)) {
    const messages = []
    const limit = messageCode.length

    for (let code = 0; code < limit; code++) {
      messages.push(MESSAGES[messageCode[code]])
    }

    return messages.join(', ')
  }

  return MESSAGES[messageCode]
}

const setInvalidParameterMessage = (code, field, messageCode, required) => {
  const requiredMessage = required ? ` ${required}` : ''
  if (messageCode) return setMessage(code, `${field}: ${setRequiredMessage(messageCode)}${requiredMessage}`)
  return setMessage(code, [field])
}

const validationErrorSchema = (type, code, values, messageCode, required) => {
  switch(code) {
    case MISSING_PARAMETER_CODE:
      return {
        message: setMessage(code, values),
        code: CODES[type][code]
      }
    case INVALID_PARAMETER_CODE:
      return {
        message: setInvalidParameterMessage(code, values, messageCode, required),
        code: CODES[type][code]
      }
    case NOT_FOUND_CODE:
      return {
        message: setNotFoundMessage(code, values),
        code: CODES[type][code]
      }
    case AUTH_FAILED_CODE:
      return {
        message: setMessage(code),
        code: CODES[type][code]
      }
  }
}

module.exports = validationErrorSchema
