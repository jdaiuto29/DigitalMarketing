'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FacebookMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FacebookMessage.belongsTo(models.User)
    }
  }
  FacebookMessage.init({
    body: DataTypes.TEXT,
    scheduledTime: DataTypes.ARRAY(DataTypes.DATE),
    status: DataTypes.STRING,
    duration: DataTypes.STRING,
    picture: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'FacebookMessage',
  });
  return FacebookMessage;
};
