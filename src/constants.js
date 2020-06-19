'use strict'

const TEST = 'test'
const PRODUCTION = 'production'
const DEVELOPMENT = 'development'

const API_V1 = '/api/v1'

const SC_404 = 404
const SC_401 = 401
const SC_403 = 403

const USER_TYPE = 'USER'
const LOGIN_TYPE = 'LOGIN'
const AUTH_TYPE = 'AUTH'
const ACTIVATION_TYPE = 'ACTIVATION'

const EMAIL_FIELD = 'email'
const LOGIN_FIELD = 'login'
const USERNAME_FIELD = 'username'
const PASSWORD_FIELD = 'password'

const WHITE_SPACES = /\s/g
const USERNAME_MAX_LENGTH = 30
const EMAIL_MAX_LENGTH = 120
const EMAIL_PATTERN = /[a-z0-9_.]+@([a-z]+\.)[a-z{2}]+(\.([a-z]{2}))?$/
const PASSWORD_MAX_LENGTH = 22
const PASSWORD_MIN_LENGTH = 8
const NUMBERS_PATTERN = /[0-9]+/
const LETTERS_PATTERN = /[a-zA-Z]+/
const SPECIAL_CHARACTER_PATTERN = /[\W]+/
const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\W)[a-zA-Z0-9-_\W]+$/
const AT_SYMBOL = '@'

const MISSING_PARAMETER_CODE = 'missingParameter'
const INVALID_PARAMETER_CODE = 'invalidParameter'
const NOT_FOUND_CODE = 'notFound'
const LOGIN_FAILED_CODE = 'loginFailed'
const AUTH_FAILED_CODE = 'authFailed'
const FORBIDDEN_CODE = 'forbidden'
const ACTIVATE_USER_CODE = 'activateUser'

const WHITE_SPACES_CODE = 'whiteSpaces'
const MAX_LENGTH_CODE = 'maxLength'
const MIN_LENGTH_CODE = 'minLength'
const UNIQUE_CODE = 'unique'
const NOT_CONTAIN_LETTERS = 'letters'
const NOT_CONTAIN_NUMBERS = 'numbers'
const NOT_CONTAIN_SPECIAL_CHARACTER = 'specialCharacter'
const AT_SYMBOL_CODE = 'atSymbol'
const UNLOGGED_IN_CODE = 'unloggedIn'
const AUTH_TOKEN_CODE = 'authToken'
const ERROR_TRYING_TO = 'errorTryingTo'
const ACTIVE_ALREADY = 'activeAlready'
const ERROR_HAS_OCCURRED = 'errorHasOccurred'
const DONT_MATCH = 'dontMatch'
const NOT_ACTIVE = 'notActive'

const USER_REQUIRED_PARAMETERS = [EMAIL_FIELD, USERNAME_FIELD, PASSWORD_FIELD]
const LOGIN_REQUIRED_PARAMETERS = [LOGIN_FIELD, PASSWORD_FIELD]

const ENV_PREFIX = {
  [TEST]: 'TST_',
  [PRODUCTION]: 'PROD_',
  [DEVELOPMENT]: 'DEV_'
}

const STATUS_CODES = {
  [NOT_FOUND_CODE]: SC_404,
  [LOGIN_FAILED_CODE]: SC_401,
  [AUTH_FAILED_CODE]: SC_401,
  [FORBIDDEN_CODE]: SC_403
}
const CODES = {
  [USER_TYPE]: {
    [MISSING_PARAMETER_CODE]: 'user0',
    [INVALID_PARAMETER_CODE]: 'user1'
  },
  [LOGIN_TYPE]: {
    [MISSING_PARAMETER_CODE]: 'login0',
    [NOT_FOUND_CODE]: 'login1',
    [LOGIN_FAILED_CODE]: 'login2',
    [DONT_MATCH]: 'login3',
    [NOT_ACTIVE]: 'login4'
  },
  [AUTH_TYPE]: {
    [AUTH_FAILED_CODE]: 'auth0',
    [UNLOGGED_IN_CODE]: 'auth1',
    [FORBIDDEN_CODE]: 'auth2'
  },
  [ACTIVATION_TYPE]: {
    [ACTIVATE_USER_CODE]: 'activation0'
  }
}
const MESSAGES = {
  [MISSING_PARAMETER_CODE]: 'Missing required parameter',
  [INVALID_PARAMETER_CODE]: 'Invalid parameter',
  [NOT_FOUND_CODE]: 'Not found',
  [WHITE_SPACES_CODE]: 'Cannot contain white spaces',
  [MAX_LENGTH_CODE]: 'Exceed maximum allowed length',
  [MIN_LENGTH_CODE]: 'Have fewer characters than the minimum required',
  [UNIQUE_CODE]: 'Must be unique',
  [NOT_CONTAIN_LETTERS]: 'Must contain letters',
  [NOT_CONTAIN_NUMBERS]: 'Must contain numbers',
  [NOT_CONTAIN_SPECIAL_CHARACTER]: 'Must contain special character',
  [AT_SYMBOL_CODE]: 'Cannot contain @',
  [LOGIN_FAILED_CODE]: 'Authentication failed',
  [AUTH_FAILED_CODE]: 'Unauthorized request',
  [UNLOGGED_IN_CODE]: 'User not logged in',
  [AUTH_TOKEN_CODE]: 'Auth token',
  [FORBIDDEN_CODE]: 'Forbidden request',
  [ERROR_TRYING_TO]: 'An error has occurred trying to',
  [ACTIVATE_USER_CODE]: 'Activation user error',
  [ACTIVE_ALREADY]: 'Is active already',
  [ERROR_HAS_OCCURRED]: 'An error has occurred on',
  [DONT_MATCH]: 'Username or password doesn\'t match',
  [NOT_ACTIVE]: 'The user is not activated'
}

exports.TEST = TEST
exports.PRODUCTION = PRODUCTION
exports.DEVELOPMENT = DEVELOPMENT

exports.API_V1 = API_V1

exports.USER_TYPE = USER_TYPE
exports.LOGIN_TYPE = LOGIN_TYPE
exports.AUTH_TYPE = AUTH_TYPE
exports.ACTIVATION_TYPE = ACTIVATION_TYPE

exports.EMAIL_FIELD = EMAIL_FIELD
exports.LOGIN_FIELD = LOGIN_FIELD
exports.USERNAME_FIELD = USERNAME_FIELD
exports.PASSWORD_FIELD = PASSWORD_FIELD

exports.WHITE_SPACES = WHITE_SPACES
exports.USERNAME_MAX_LENGTH = USERNAME_MAX_LENGTH
exports.EMAIL_MAX_LENGTH = EMAIL_MAX_LENGTH
exports.EMAIL_PATTERN = EMAIL_PATTERN
exports.PASSWORD_MAX_LENGTH = PASSWORD_MAX_LENGTH
exports.PASSWORD_MIN_LENGTH = PASSWORD_MIN_LENGTH
exports.LETTERS_PATTERN = LETTERS_PATTERN
exports.NUMBERS_PATTERN = NUMBERS_PATTERN
exports.SPECIAL_CHARACTER_PATTERN = SPECIAL_CHARACTER_PATTERN
exports.PASSWORD_PATTERN = PASSWORD_PATTERN
exports.AT_SYMBOL = AT_SYMBOL
exports.UNLOGGED_IN_CODE = UNLOGGED_IN_CODE
exports.AUTH_TOKEN_CODE = AUTH_TOKEN_CODE
exports.ERROR_TRYING_TO = ERROR_TRYING_TO
exports.ACTIVE_ALREADY = ACTIVE_ALREADY
exports.ERROR_HAS_OCCURRED = ERROR_HAS_OCCURRED
exports.DONT_MATCH = DONT_MATCH
exports.NOT_ACTIVE = NOT_ACTIVE

exports.INVALID_PARAMETER_CODE = INVALID_PARAMETER_CODE
exports.MISSING_PARAMETER_CODE = MISSING_PARAMETER_CODE
exports.NOT_FOUND_CODE = NOT_FOUND_CODE
exports.LOGIN_FAILED_CODE = LOGIN_FAILED_CODE
exports.AUTH_FAILED_CODE = AUTH_FAILED_CODE
exports.FORBIDDEN_CODE = FORBIDDEN_CODE
exports.ACTIVATE_USER_CODE = ACTIVATE_USER_CODE

exports.WHITE_SPACES_CODE = WHITE_SPACES_CODE
exports.MAX_LENGTH_CODE = MAX_LENGTH_CODE
exports.MIN_LENGTH_CODE = MIN_LENGTH_CODE
exports.UNIQUE_CODE = UNIQUE_CODE
exports.NOT_CONTAIN_LETTERS = NOT_CONTAIN_LETTERS
exports.NOT_CONTAIN_NUMBERS = NOT_CONTAIN_NUMBERS
exports.NOT_CONTAIN_SPECIAL_CHARACTER = NOT_CONTAIN_SPECIAL_CHARACTER
exports.AT_SYMBOL_CODE = AT_SYMBOL_CODE

exports.USER_REQUIRED_PARAMETERS = USER_REQUIRED_PARAMETERS
exports.LOGIN_REQUIRED_PARAMETERS = LOGIN_REQUIRED_PARAMETERS

exports.ENV_PREFIX = ENV_PREFIX

exports.STATUS_CODES = STATUS_CODES
exports.CODES = CODES
exports.MESSAGES = MESSAGES
