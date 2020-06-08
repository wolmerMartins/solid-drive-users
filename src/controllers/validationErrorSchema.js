'use strict'

const {
  CODES,
  MESSAGES,
  ACTIVE_ALREADY,
  NOT_FOUND_CODE,
  FORBIDDEN_CODE,
  AUTH_FAILED_CODE,
  LOGIN_FAILED_CODE,
  ACTIVATE_USER_CODE,
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

const setActivateUserMessage = (code, values, messageCode) => {
  if (!messageCode) return setMessage(code, values)

  return setMessage(code, `User ID: ${values} ${MESSAGES[ACTIVE_ALREADY]}`)
}

const setAuthFailedMessage = (code, values, messageCode) => {
  if (!messageCode) return setMessage(code, values)

  return setMessage(code, `${MESSAGES[messageCode]}${values ? `: ${setValues(values)}` : ''}`)
}

const setNotFoundMessage = (code, values) => {
  const { username, email, id } = values
  const message = `User: ${username
    ? `username: ${username}`
    : email
      ? `email: ${email}`
      : `id: ${id}`}`

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
    case LOGIN_FAILED_CODE:
      return {
        message: setMessage(code),
        code: CODES[type][code]
      }
    case AUTH_FAILED_CODE:
      return {
        message: setAuthFailedMessage(code, values, messageCode),
        code: CODES[type][code]
      }
    case FORBIDDEN_CODE:
      return {
        message: setMessage(code),
        code: CODES[type][code]
      }
    case ACTIVATE_USER_CODE:
      return {
        message: setActivateUserMessage(code, values, messageCode),
        code: CODES[type][code]
      }
  }
}

module.exports = validationErrorSchema
