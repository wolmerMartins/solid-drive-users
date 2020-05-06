'use strict'

const chai = require('chai')
const expect = chai.expect

const { hashPassword } = require('../password')

describe('password', () => {
  const password = 'testasdas1135234#&*&$%'

  describe('hashPassword', () => {
    it('Should create a hash from the given password', () => {
      const hashPass = hashPassword({ password })

      expect(hashPass.length)
        .to.be.equal(113)

      expect(hashPass.split('$').length)
        .to.be.equal(2)

      expect(hashPass)
        .to.not.be.equal(password)
    })
  })
})
