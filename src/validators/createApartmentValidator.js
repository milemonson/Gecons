const { check } = require("express-validator");
const { Op } = require("sequelize");
const { Apartment } = require("../database/models");

module.exports = [

    check("name").trim()
        .notEmpty().withMessage("No puede estar vacío.").bail()
        .isLength({ max : 191 }).withMessage("Máximo de caracteres superado.").bail()
        .custom(async (value, { req }) => {

            let result = await Apartment.findOne({
                where : { 
                    [Op.and] : [
                        {buildingId : req.body.buildingId},
                        { name : value } 
                    ]
                }
            });

            if(result !== null) return Promise.reject();
            else return Promise.resolve();

        }).withMessage("Ese departamento ya está registrado en el edificio."),

    check("description").optional({ checkFalsy : true }).trim()
        .isLength({ max : 500 }).withMessage("Máximo de caracteres superado."),

    // Fecha de inicio
    check("init-date")
        .notEmpty().withMessage("Campo obligatório.").bail()
        .isDate().withMessage("Formato inválido.").bail()
        .custom((value, { req } ) => {

            return req.body["end-date"] != "";

        }).withMessage("Debe llenar ambas fechas.").bail()
        .custom((value, {req}) => {

            let initDate = new Date(value);
            let endDate = new Date(req.body["end-date"]);

            return initDate < endDate;

        }).withMessage("La fecha de inicio no puede ser posterior a la de finalización."),

    // Fecha de finalización
    check("end-date")
        .notEmpty().withMessage("Campo obligatório.").bail()
        .isDate().withMessage("Formato inválido.").bail()
        .custom((value, { req } ) => {

            return req.body["init-date"] != "";

        }).withMessage("Debe llenar ambas fechas.").bail()
        .custom((value, {req}) => {

            let endDate = new Date(value);
            let initDate = new Date(req.body["init-date"]);

            return initDate < endDate;

        }).withMessage("La fecha de inicio no puede ser posterior a la de finalización."),

    check("price").trim()
        .notEmpty().withMessage("Campo obligatório.").bail()
        .isNumeric().withMessage("Formato inválido.").bail()
        .custom(value => {
            return value > 0;
        }).withMessage("No puede ser menor a cero.")

]