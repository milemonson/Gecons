const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const { Building, Apartment } = require("../database/models");

const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "public", "img", "uploaded");

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
            
            let newApartment = {
                name : req.body.name,
                price : Number(req.body.price),
                initDate : req.body["init-date"],
                endDate : req.body["end-date"],
                buildingId : req.body.buildingId
            }

            if(req.body.description != "")
                newApartment.description = req.body.description;

            Apartment.create(newApartment)
                .then(created => {

                    fs.mkdirSync(path.join(DOCS_DIRECTORY, req.body.buildingName, created.name));
                    fs.mkdirSync(path.join(IMG_DIRECTORY, req.body.buildingName, created.name));

                    // TODO : Insertar en BD las imágenes y el documento
                    res.redirect("/admin/apartments");
                });
                // TODO : Atajar el error.
            
        } else {
            res.render("admin/addApartment", {
                errors : errors.mapped(),
                userInput : req.body,
                building : { 
                    name : req.body.buildingName,
                    id : req.body.buildingId
                }
            });
        }

    },

    /** Vista de edición */
    edit : (req, res) => {

    },

    /** Procesamiento de la vista de edición */
    update : (req, res) => {
        
    }

}