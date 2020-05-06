'use strict'

describe('unit tests', () => {
  describe('controllers', () => {
    require('../../src/controllers/test/pushpin.test')
    require('../../src/controllers/test/password.test')
    require('../../src/controllers/test/validateUser.test')
    require('../../src/controllers/test/validationErrorSchema.test')
  })

  describe('models', () => {
    require('../../src/models/test/User.test')
  })
})