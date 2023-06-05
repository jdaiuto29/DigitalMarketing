'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Customer)
      User.hasMany(models.EmailMessage)
      User.hasMany(models.TextMessage)
      User.hasMany(models.FacebookMessage)
      User.hasMany(models.InstagramMessage)
      User.hasMany(models.TwitterMessage)
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    companyName: DataTypes.STRING,
    position: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    facebook: DataTypes.JSON,
    instagram: DataTypes.JSON,
    twitter: DataTypes.JSON,
    qrCodePromo: DataTypes.STRING,
    qrCodeMenu: DataTypes.STRING,
    menuPdf: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
  }
  });
  return User;
};

const hashPassword = async (user) => {
  if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10)
  }

  return user
}