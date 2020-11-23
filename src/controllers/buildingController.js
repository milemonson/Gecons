const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { validationResult, Result } = require("express-validator");
const { Building } = require("../database/models");

const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "public", "img", "uploaded");
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
                // TODO : Procesar el mail
                .then(created => {
                    // Creación de las carpetas para subida de documentos e imágenes
                    fs.mkdirSync(path.join(DOCS_DIRECTORY, created.name));
                    fs.mkdirSync(path.join(IMG_DIRECTORY, created.name));

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
            // TODO : Revisar el cambio de contraseñas, no se debería cambiar
            // en caso de que no se ingrese nada...
            let updated = { name : req.body.name }

            if(req.body.password && req.body.password != ""){
                updated.password = bcrypt.hashSync(req.body.password, NUMBER_OF_SALT);
            }

            // TODO : Procesar el mail
            Building.findByPk(Number(req.params.id), { attributes : ["name"] })
                .then(result => {
                    // Renombramiento de las carpetas de archivos
                    if(result.name != updated.date){
                        // Documentos
                        fs.renameSync(path.join(DOCS_DIRECTORY, result.name),
                                      path.join(DOCS_DIRECTORY, updated.name));
                        // Imágenes 
                        fs.renameSync(path.join(IMG_DIRECTORY, result.name),
                                      path.join(IMG_DIRECTORY, updated.name));
                    }
                    
                    return Building.update(updated, { where : { "id" : req.params.id } });
                })
                .then(() => {
                    res.redirect("/admin/buildings");
                });
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