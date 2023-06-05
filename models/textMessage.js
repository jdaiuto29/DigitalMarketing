'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TextMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TextMessage.belongsTo(models.User)
    }
  }
  TextMessage.init({
    body: DataTypes.STRING,
    scheduledTime: DataTypes.ARRAY(DataTypes.DATE),
    customers: DataTypes.ARRAY(DataTypes.STRING),
    status: DataTypes.STRING,
    duration: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'TextMessage',
  });
  return TextMessage;
};
