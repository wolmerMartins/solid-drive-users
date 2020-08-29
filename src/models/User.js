'use strict'

const { DataTypes } = require('sequelize')

const setup = async (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(113),
      allowNull: false
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['password']
        }
      }
    }
  })

  const UserWithPassword = User.scope('withPassword')

  await User.sync()

  module.exports.createUser = userData => {
    return User.create(userData, { raw: true })
  }

  module.exports.findUser = (where, withPassword) => {
    const Model = withPassword
      ? UserWithPassword
      : User
    return Model.findOne({ where, limit: 1 }, { raw: true })
  }
}

module.exports = setup
