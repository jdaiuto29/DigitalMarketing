'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TwitterMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TwitterMessage.belongsTo(models.User)
    }
  }
  TwitterMessage.init({
    body: DataTypes.STRING,
    scheduledTime: DataTypes.ARRAY(DataTypes.DATE),
    status: DataTypes.STRING,
    duration: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'TwitterMessage',
  });
  return TwitterMessage;
};
