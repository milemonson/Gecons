'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Apartment extends Model {
        /**
         * Asociaciones
         */
        static associate(models) {
            // define association here
        }
    };
    Apartment.init({
        buildingId: {
            type : DataTypes.INTEGER.UNSIGNED,
            field : "building_id",
            allowNull : false
        },
        name: {
            type : DataTypes.STRING(191),
            allowNull : false,
            unique : true
        },
        description: {
            type : DataTypes.STRING(500),
            allowNull : true
        },
        initDate: {
            type : DataTypes.DATE,
            field : "init_date",
            allowNull : false
        },
        endDate: {
            type : DataTypes.DATE,
            field : "end_date",
            allowNull : false
        },
        price: {
            type : DataTypes.DECIMAL(10, 2)
        },
        documentUrl : {
            type : DataTypes.STRING(255),
            field : "document_url",
            allowNull : true
        }
    }, {
        sequelize,
        modelName: 'Apartment',
    });
    return Apartment;
};