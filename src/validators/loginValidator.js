const { check } = require("express-validator");

// La validación de la existencia del y usuario y contraseña correcta quedan relegados al controlador
// para evitar duplicar consultas a la BD
module.exports = [

    check("user").trim()
        .notEmpty().withMessage("Campo obligatório.").bail()
        .isLength({ max : 191 }).withMessage("Cantidad máxima de caracteres excedida."),

    check("password")
        .notEmpty().withMessage("Campo obligatório").bail()
        .isLength({min : 8, max : 18}).withMessage("Cantidad de caracteres errónea."),

]