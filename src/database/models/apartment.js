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
            this.belongsTo(models.Building);
            this.hasMany(models.Image);
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
            allowNull : false
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
        },
        createdAt : {
            type : DataTypes.DATE,
            field : "created_at"
        }
    }, {
        sequelize,
        modelName: 'Apartment',
    });
    return Apartment;
};