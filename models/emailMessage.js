'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmailMessage.belongsTo(models.User)
    }
  }
  EmailMessage.init({
    body: DataTypes.TEXT,
    scheduledTime: DataTypes.ARRAY(DataTypes.DATE),
    customers: DataTypes.ARRAY(DataTypes.STRING),
    status: DataTypes.STRING,
    duration: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'EmailMessage',
  });
  return EmailMessage;
};
