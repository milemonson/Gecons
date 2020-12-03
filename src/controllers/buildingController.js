const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Building } = require("../database/models");

const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "public", "img", "uploaded");
const SALT_NUMBER = 12;

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
                password : bcrypt.hashSync(req.body.password, SALT_NUMBER)
            }

            Building.create(newBuilding)
                // TODO : Procesar el mail
                .then(() => {
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
        
        let errors = validationResult(req);

        if(errors.isEmpty()){
            let updated = { name : req.body.name }

            if(req.body.password && req.body.password != ""){
                updated.password = bcrypt.hashSync(req.body.password, SALT_NUMBER);
            }

            // TODO : Procesar el mail
            Building.update(updated, { 
                where : { "id" : req.params.id } 
            })
                .then(() => {
                    res.redirect("/admin/buildings");
                })
                // TODO : Atajar el error
        } else {

            Building.findByPk(req.params.id, {attributes : ["id", "name"]})
                .then(editable => {
                    res.render("admin/editbuilding", {
                        errors : errors.mapped(),
                        editable : editable,
                        userInput : {
                            "send-to" : req.body["send-to"]
                        }
                    })
                });
        }
    }

}