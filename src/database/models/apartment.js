'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Apartment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Apartment.init({
        building_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        init_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        price: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: 'Apartment',
    });
    return Apartment;
};