const { check } = require("express-validator");

module.exports = [

    check("password").optional({ checkFalsy : true })
        .isLength({min : 8, max : 18}).withMessage("Longitud de caracteres errónea.").bail()
        .custom(value => {
            let upper = new RegExp("[A-Z]");
            let lower = new RegExp("[a-z]");
            let number = new RegExp("[0-9]");

            return upper.test(value) && lower.test(value) && number.test(value);
        }).withMessage("No cumple los requerimientos de seguridad."),

    check("oldPassword")
        .notEmpty().withMessage("No puede estar vacío.")

]