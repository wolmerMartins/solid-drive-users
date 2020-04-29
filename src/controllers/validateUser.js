'use strict'

const model = require('../models/User')
const UserError = require('../UserError')
const validationErrorSchema = require('./validationErrorSchema')
const {
  UNIQUE_CODE,
  EMAIL_FIELD,
  WHITE_SPACES,
  EMAIL_PATTERN,
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
) => validationErrorSchema(INVALID_PARAMETER_CODE, field, messageCode, required);

const validateIfIsUnique = async (findBy, field) => {
  const user = await model.User.findOne({
    where: { ...findBy }
  })

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
  validateIfIsValidEmail(email)
  validateMaxLength(email, EMAIL_MAX_LENGTH, EMAIL_FIELD)
  await validateIfIsUnique({ email }, EMAIL_FIELD)
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
  validateIfHaveNoSpaces(username)
  validateMaxLength(username, USERNAME_MAX_LENGTH, USERNAME_FIELD)
  await validateIfIsUnique({ username }, USERNAME_FIELD)
}

const validateUserRequiredFields = user => {
  const difference = USER_REQUIRED_PARAMETERS
    .filter(required => !Object.keys(user).includes(required))

  if (difference.length) {
    const { code, message } = validationErrorSchema(MISSING_PARAMETER_CODE, difference)
    
    throw new UserError(message, code)
  }
}

const validateUser = user => new Promise(async (resolve, reject) => {
  try {
    validateUserRequiredFields(user)
    await validateUsername(user)
    await validateEmail(user)
    validatePassword(user)
    resolve(user)
  } catch(err) {
    reject(err)
  }
})

module.exports = validateUser
