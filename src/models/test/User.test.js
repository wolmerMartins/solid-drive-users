'use strict'

const chai = require('chai')
const SequelizeMock = require('sequelize-mock')

const userModel = require('../User')

const expect = chai.expect
const dbMock = new SequelizeMock()
const UserMock = dbMock.define('User', {
  username: 'test',
  email: 'test@test.com',
  password: 'test123456$'
}, {
  tableName: 'users',
  raw: true
})
const sequelizeMock = {
  define: () => UserMock
}

userModel(sequelizeMock)

describe('User', () => {
  const newUser = {
    username: 'mocker',
    email: 'mocker@test.com',
    password: '1234mocker%^'
  }

  describe('createUser', () => {
    it('Should create a new User on DB and return his data with an extra id, createdAt, and updatedAt timestamps', async () => {
      const { dataValues } = await userModel.createUser(newUser)

      expect(dataValues)
        .to.have.all.keys('id', 'username', 'email', 'password', 'createdAt', 'updatedAt')

      expect(dataValues)
        .to.have.property('username', newUser.username)

      expect(dataValues)
        .to.have.property('email', newUser.email)
    })
  })

  describe('findUser', () => {
    it('Should find a User on DB and returns his data', async () => {
      const { dataValues } = await userModel.findUser({ username: 'test' })

      expect(dataValues)
        .to.have.all.keys('id', 'username', 'email', 'password', 'createdAt', 'updatedAt')

      expect(dataValues)
        .to.have.property('username', 'test')

      expect(dataValues)
        .to.have.property('email', 'test@test.com')
    })
  })
})
