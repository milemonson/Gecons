const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { Building } = require("../database/models");

module.exports = [

    check("name").trim()
        .notEmpty().withMessage("No puede estar vacío.").bail()
        .isLength({max : 191}).withMessage("Máximo de caracteres superado.").bail()
        .custom(async (value, { req }) => {
            let result = await Building.findOne({ // Checkeo de nombre en uso
                attributes : ["id"],
                where : { name : value }
            });
            // El nombre puede coincidir con el anterior pero no con el de otro edificio
            if(result !== null && result.id != req.params.id) return Promise.reject();
            else return Promise.resolve();
        }).withMessage("Nombre del edificio en uso."),

    check("password")
        .notEmpty().withMessage("No puede estar vacío.").bail()
        .isLength({min : 8, max : 18}).withMessage("Longitud de caracteres errónea.").bail()
        .custom(value => {
            let upper = new RegExp("[A-Z]");
            let lower = new RegExp("[a-z]");
            let number = new RegExp("[0-9]");

            return upper.test(value) && lower.test(value) && number.test(value);
        }).withMessage("No cumple los requerimientos de seguridad."),

    check("oldPassword")
        .notEmpty().withMessage("No puede estar vacío.").bail()
        .custom(async (value, { req }) => {
            let result = await Building.findByPk(req.params.id, { attributes : ["password"] });
            // Validación de la contraseña actual
            if(bcrypt.compareSync(value, result.password)) 
                return Promise.resolve();
            else
                return Promise.reject();
        }).withMessage("Contraseña incorrecta."),

    check("send-to").optional({checkFalsy : true}).trim()
        .isEmail().withMessage("Debe tener un formato de mail válido.")

]