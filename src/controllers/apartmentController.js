const { validationResult } = require("express-validator");
const { Building, Apartment } = require("../database/models");

module.exports = {

    /** Listado de todos los departamentos */
    show : (req, res) => {
        res.render("admin/apartments");
    },

    /** Detalle de un departamento */
    detail : (req, res) => {
        
    },

    /** Vista de creación */
    create : (req, res) => {
        
        Building.findByPk(Number(req.query.b), { attributes : ["id", "name"] })
            .then(result => {
                res.render("admin/addApartment", { 
                    building : result
                });
            })

    },

    /** Procesamiento de la vista de creación */
    store : (req, res) => {

        let errors = validationResult(req);
        
        if(errors.isEmpty()){
            res.send("UwW ;D");
        } else {
            res.render("admin/addApartment", {
                errors : errors.mapped(),
                userInput : req.body,
                building : { 
                    name : req.body.buildingName,
                    id : req.body.buildingId
                }
            })
        }

    },

    /** Vista de edición */
    edit : (req, res) => {
    },

    /** Procesamiento de la vista de edición */
    update : (req, res) => {
        
    }

}