const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Building } = require("../database/models");

const NUMBER_OF_SALT = 12;

module.exports = {

    /** Listado de todos los edificios registrados */
    show : (req, res) => {
        res.render("admin/buildings");
    },

    /** Vista de creación de un nuevo edificio */
    create : (req, res) => {
        res.render("admin/addBuilding");
    },

    /** Procesamiento de la creación de un edificio */
    store : (req, res) => {
        let errors = validationResult(req);

        if(errors.isEmpty()){
            
            let newBuilding = {
                name : req.body.name,
                password : bcrypt.hashSync(req.body.password, NUMBER_OF_SALT)
            }

            Building.create(newBuilding)
                .then(created => {
                    // TODO : Crear las carpetas pertinentes con mdirp
                    // TODO : Procesar el mail
                    res.redirect("/admin/buildings");
                });
                // TODO : Atajar el error

        } else {

            res.render("admin/addBuilding", {
                errors : errors.mapped(),
                userInput : {
                    name : req.body.name,
                    "send-to" : req.body["send-to"]
                }
            });
        }
    },

    /** Edición de un edificio existente */
    edit : (req, res) => {

        Building.findByPk(req.params.id, { attributes : ["id", "name"]})
            .then(editable => {

                res.render("admin/editBuilding", {
                    editable : editable
                });
            })
    },

    /** Procesamiento de la edición de un edificio existente */
    update : (req, res) => {
        
    }

}