'use strict'

const model = require('../models/User')
const UserError = require('../UserError')
const { hasDifference } = require('./utils')
const validationErrorSchema = require('./validationErrorSchema')
const {
  USER_TYPE,
  AT_SYMBOL,
  UNIQUE_CODE,
  EMAIL_FIELD,
  WHITE_SPACES,
  EMAIL_PATTERN,
  AT_SYMBOL_CODE,
  USERNAME_FIELD,
  PASSWORD_FIELD,
  MAX_LENGTH_CODE,
  MIN_LENGTH_CODE,
  LETTERS_PATTERN,
  NUMBERS_PATTERN,
  EMAIL_MAX_LENGTH,
  PASSWORD_PATTERN,
  WHITE_SPACES_CODE,
  NOT_CONTAIN_LETTERS,
  NOT_CONTAIN_NUMBERS,
  USERNAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  MISSING_PARAMETER_CODE,
  INVALID_PARAMETER_CODE,
  USER_REQUIRED_PARAMETERS,
  SPECIAL_CHARACTER_PATTERN,
  NOT_CONTAIN_SPECIAL_CHARACTER
} = require('../constants')

const validationInvalidParameterError = (
  field,
  messageCode,
  required
) => validationErrorSchema(USER_TYPE, INVALID_PARAMETER_CODE, field, messageCode, required);

const validateIfIsUnique = async (where, field) => {
  const user = await model.findUser(where)

  if (user) {
    const {
      code,
      message
    } = validationInvalidParameterError(field, UNIQUE_CODE)

    throw new UserError(message, code)
  }

  return true
}

const validateMinLength = (value, minLength, field) => {
  if (value.length < minLength) {
    const {
      code,
      message
    } = validationInvalidParameterError(field, MIN_LENGTH_CODE, PASSWORD_MIN_LENGTH)

    throw new UserError(message, code)
  }
}

const validateMaxLength = (value, maxLength, field) => {
  if (value.length > maxLength) {
    const {
      code,
      message
    } = validationInvalidParameterError(field, MAX_LENGTH_CODE, maxLength)

    throw new UserError(message, code)
  }
}

const validateIfIsValidPassword = password => {
  if (!PASSWORD_PATTERN.test(password)) {
    const messages = []

    if (!LETTERS_PATTERN.test(password)) messages.push(NOT_CONTAIN_LETTERS)
    if (!NUMBERS_PATTERN.test(password)) messages.push(NOT_CONTAIN_NUMBERS)
    if (!SPECIAL_CHARACTER_PATTERN.test(password)) messages.push(NOT_CONTAIN_SPECIAL_CHARACTER)

    const { message, code } = validationInvalidParameterError(PASSWORD_FIELD, messages)

    throw new UserError(message, code)
  }
}

const validatePassword = ({ password }) => {
  if (!password) return

  validateMaxLength(password, PASSWORD_MAX_LENGTH, PASSWORD_FIELD)
  validateMinLength(password, PASSWORD_MIN_LENGTH, PASSWORD_FIELD)
  validateIfIsValidPassword(password)
}

const validateIfIsValidEmail = email => {
  if (!EMAIL_PATTERN.test(email)) {
    const { message, code } = validationInvalidParameterError(EMAIL_FIELD)

    throw new UserError(message, code)
  }
}

const validateEmail = async ({ email }) => {
  if (!email) return

  validateIfIsValidEmail(email)
  validateMaxLength(email, EMAIL_MAX_LENGTH, EMAIL_FIELD)
  await validateIfIsUnique({ email }, EMAIL_FIELD)
}

const validateIfHaveAtSymbol = username => {
  if (username.includes(AT_SYMBOL)) {
    const {
      code,
      message
    } = validationInvalidParameterError(USERNAME_FIELD, AT_SYMBOL_CODE)

    throw new UserError(message, code)
  }
}

const validateIfHaveNoSpaces = username => {
  if (WHITE_SPACES.test(username)) {
    const {
      code,
      message
    } = validationInvalidParameterError(USERNAME_FIELD, WHITE_SPACES_CODE)
    
    throw new UserError(message, code)
  }
}

const validateUsername = async ({ username }) => {
  if (!username) return

  validateIfHaveNoSpaces(username)
  validateIfHaveAtSymbol(username)
  validateMaxLength(username, USERNAME_MAX_LENGTH, USERNAME_FIELD)
  await validateIfIsUnique({ username }, USERNAME_FIELD)
}

const validateUserRequiredFields = user => {
  const difference = hasDifference({ body: user, required: USER_REQUIRED_PARAMETERS })

  if (difference.length) {
    const { code, message } = validationErrorSchema(USER_TYPE, MISSING_PARAMETER_CODE, difference)
    
    throw new UserError(message, code)
  }
}

exports.validateUserRequiredFields = validateUserRequiredFields
exports.validateUsername = validateUsername
exports.validateEmail = validateEmail
exports.validatePassword = validatePassword
