'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Asociaciones
         */
        static associate(models) {
            this.belongsTo(models.Admin)
        }
    };
    Token.init({
        token: {
            type : DataTypes.STRING(191),
            allowNull : false,
            unique : true
        },
        adminId: {
            type : DataTypes.INTEGER.UNSIGNED,
            field : "admin_id"
        }
    }, {
        sequelize,
        modelName: 'Token',
    });
    return Token;
};