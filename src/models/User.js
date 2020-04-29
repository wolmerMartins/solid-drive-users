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
      type: DataTypes.STRING(22),
      allowNull: false
    }
  }, {
    tableName: 'users'
  })

  await User.sync()

  module.exports.User = User
}

module.exports = setup
