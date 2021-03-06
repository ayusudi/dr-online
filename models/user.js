'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  const hash = require('../helpers/passwordHash')
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Transaction)
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    job: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [10, 13],
          msg: "Phone number must be between 10 and 13 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid Email, please put another email"
        }
      }
    },
    role: DataTypes.STRING,
    username: DataTypes.STRING
  }, {sequelize})

  User.addHook('beforeCreate', (user) => {
    user.password = hash(user.password)
  })
  return User;
};