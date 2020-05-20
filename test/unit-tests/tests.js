'use strict'

describe('controllers', () => {
  require('../../src/controllers/test/jwt.test')
  require('../../src/controllers/test/utils.test')
  require('../../src/controllers/test/pushpin.test')
  require('../../src/controllers/test/password.test')
  require('../../src/controllers/test/validateUser.test')
  require('../../src/controllers/test/validateLogin.test')
  require('../../src/controllers/test/validationErrorSchema.test')
})

describe('models', () => {
  require('../../src/models/test/User.test')
  require('../../src/models/test/Session.test')
})