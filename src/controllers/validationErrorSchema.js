'use strict'

const {
  MESSAGES,
  MISSING_PARAMETER_CODE,
  INVALID_PARAMETER_CODE
} = require('../constants')

const setMessage = (code, values) => {
  if (values.length) return `${MESSAGES[code]}: ${values.join(', ')}`
  return MESSAGES[code]
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
  if (messageCode) return setMessage(code, [`${field}: ${setRequiredMessage(messageCode)}${requiredMessage}`])
  return setMessage(code, [field])
}

const validationErrorSchema = (code, values, messageCode, required) => {
  switch(code) {
    case MISSING_PARAMETER_CODE:
      return {
        message: setMessage(MISSING_PARAMETER_CODE, values),
        code: MISSING_PARAMETER_CODE
      }
    case INVALID_PARAMETER_CODE:
      return {
        message: setInvalidParameterMessage(INVALID_PARAMETER_CODE, values, messageCode, required),
        code: INVALID_PARAMETER_CODE
      }
  }
}

module.exports = validationErrorSchema
