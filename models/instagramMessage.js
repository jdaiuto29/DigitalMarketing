'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InstagramMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InstagramMessage.belongsTo(models.User)
    }
  }
  InstagramMessage.init({
    body: DataTypes.STRING,
    scheduledTime: DataTypes.ARRAY(DataTypes.DATE),
    status: DataTypes.STRING,
    duration: DataTypes.STRING,
    picture: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'InstagramMessage',
  });
  return InstagramMessage;
};
