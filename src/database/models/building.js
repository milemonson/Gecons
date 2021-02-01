'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Building extends Model {
        /**
         * Asociaciones
         */
        static associate(models) {
            this.hasMany(models.Apartment);
        }
    };
    Building.init({
        name: {
            type : DataTypes.STRING(191),
            allowNull : false,
            unique : true
        },
        password: {
            type : DataTypes.STRING(70),
            allowNull : false
        }
    }, {
        sequelize,
        modelName: 'Building',
    });
    return Building;
};