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
        
    },

    /** Vista de edición */
    edit : (req, res) => {
    },

    /** Procesamiento de la vista de edición */
    update : (req, res) => {
        
    }

}