'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Asociaciones
         */
        static associate(models) {
            this.hasMany(models.Token);
        }
    };
    Admin.init({
        name: {
            type: DataTypes.STRING(191),
            allowNull : false,
            unique : true
        },
        password: {
            type: DataTypes.STRING(70),
            allowNull : false
        }
    }, {
        sequelize,
        modelName: 'Admin',
    });
    return Admin;
};