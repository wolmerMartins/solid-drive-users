'use strict'

const chai = require('chai')
const expect = chai.expect

const { hashPassword, verifyPassword } = require('../password')

describe('password', () => {
  const password = 'testasdas1135234#&*&$%'
  const passwordFail = 'testasdas#&*&$%1135234'
  const hashedPassword = 'nPlw7eBu5q32fzE+RTC/8Q==$GAT6/y8nClLIuvBasqDhxAC6/YgPEpe0xJfVk4uH6ayMRMX7NgbSXl8bDcvZ1quc/LMuX9BIkB4hw4XedMsRig=='

  describe('hashPassword', () => {
    it('Should create a hash from the given password', () => {
      const hashPass = hashPassword({ password })

      expect(hashPass)
        .to.have.lengthOf(113)

      expect(hashPass.split('$'))
        .to.have.lengthOf(2)

      expect(hashPass)
        .to.not.be.equal(password)
    })
  })

  describe('verifyPassword', () => {
    it('Should verify if the passwords match and return true', () => {
      const body = { password }
      const user = { password: hashedPassword }

      const passOk = verifyPassword({ body, user })

      expect(passOk)
        .to.be.a('boolean')

      expect(passOk)
        .to.be.true
    })

    it('Should verify if the passwords match and return false', () => {
      const body = { password: passwordFail }
      const user = { password: hashedPassword }

      const passFail = verifyPassword({ body, user })

      expect(passFail)
        .to.be.a('boolean')

      expect(passFail)
        .to.be.false
    })
  })
})
