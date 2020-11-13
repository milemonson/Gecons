'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Asociaciones
     */
    static associate(models) {
      this.belongsTo(models.Apartment);
    }
  };
  Image.init({
    url: {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    apartmentId: {
        type : DataTypes.INTEGER.UNSIGNED,
        field : "apartment_id"
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};