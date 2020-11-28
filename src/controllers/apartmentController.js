const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const { Building, Apartment, Image } = require("../database/models");

const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "public", "img", "uploaded");
const TEMP_DIRECTORY = path.join(__dirname, "..", "..", "temp");

module.exports = {

    /** Listado de todos los departamentos */
    show : (req, res) => {
        res.render("admin/apartments");
    },

    /** Detalle de un departamento */
    detail : (req, res) => {},

    /** Vista de creación */
    create : (req, res) => {
        Building.findByPk(Number(req.query.b), { attributes : ["id", "name"] })
            .then(result => {
                res.render("admin/addApartment", { 
                    building : result
                });
            });
    },

    /** Procesamiento de la vista de creación */
    store : (req, res) => {

        let errors = validationResult(req);
        let tempFilesDir = path.join(TEMP_DIRECTORY, req.body.name);
        
        if(errors.isEmpty()){
            
            // TODO : Validar los archivos subidos, imitar la estructura de errores de express-validator

            let newApartment = {
                name : req.body.name,
                price : Number(req.body.price),
                initDate : req.body["init-date"],
                endDate : req.body["end-date"],
                buildingId : req.body.buildingId
            }

            // Campos opcionales
            if(req.body.description != "")
                newApartment.description = req.body.description;
            if(req.files && req.files.doc)
                newApartment.documentUrl = req.files.doc[0].filename;

            // Directorios de los archivos
            let docsPath = path.join(DOCS_DIRECTORY, req.body.buildingName, req.body.name);
            let imgPath = path.join(IMG_DIRECTORY, req.body.buildingName, req.body.name);
            
            Apartment.create(newApartment)
                .then(created => {

                    fs.mkdirSync(docsPath);
                    fs.mkdirSync(imgPath);

                    // Movida de la carpeta temporal a la nueva carpeta
                    if(created.documentUrl){
                        fs.renameSync(
                            path.join(tempFilesDir, "docs", created.documentUrl),
                            path.join(docsPath, created.documentUrl)
                        );
                    }
                    
                    // En caso de subida de imágenes, se retornan las promesas de almacenamiento en BD,
                    // caso contrario se retorna una promesa resuelta que retorna un valor "false"
                    if(req.files && req.files.images){
                        let imagePromises = [];

                        req.files.images.forEach(element => {
                            imagePromises.push(Image.create({ 
                                url : element.filename,
                                apartmentId : created.id
                            }));
                        });

                        return Promise.all(imagePromises);
                    } else 
                        return Promise.resolve(false);
                })
                .then(results => {
                    if(results){ // En caso de que la promesa resuelta sea el registro de imágenes
                        results.forEach(image => {
                            fs.renameSync(
                                path.join(tempFilesDir, "img", image.url),
                                path.join(imgPath, image.url)
                            );
                        });
                    }

                    fs.rmdirSync(tempFilesDir, { recursive : true }); // Borrado de la carpeta temporal
                    res.redirect("/admin/apartments");
                });
                // TODO : Atajar los errores de acceso a datos
            
        } else { // En caso de errores, se descartan los archivos de la carpeta temporal
            fs.rmdirSync(tempFilesDir, { recursive : true });

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