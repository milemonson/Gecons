const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const { Building, Apartment, Image, sequelize } = require("../database/models");

const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "public", "img", "uploaded");
const TEMP_DIRECTORY = path.join(__dirname, "..", "..", "temp");

module.exports = {

    /** Listado de todos los departamentos */
    show : (req, res) => {
        res.render("admin/apartments");
    },

    /** Detalle de un departamento */
    detail : (req, res) => {
        Apartment.findByPk(Number(req.params.id), {
            include : [
                {
                    model : Image,
                    attributes : ["url"]
                },
                {
                    model : Building,
                    attributes : ["id", "name"]
                }
            ]
        }) // TODO : Contemplar el caso en el que se ingresen ids inexistentes
            .then(result => {
                res.render("admin/apartmentDetail", {
                    apartment : result
                });
            });
    },

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
            
            Apartment.create(newApartment)
                .then(created => {

                    // Movida de la carpeta temporal a la nueva carpeta
                    if(created.documentUrl){
                        fs.renameSync(
                            path.join(tempFilesDir, "docs", created.documentUrl),
                            path.join(DOCS_DIRECTORY, created.documentUrl)
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
                                path.join(IMG_DIRECTORY, image.url)
                            );
                        });
                    }

                    fs.rmdirSync(tempFilesDir, { recursive : true }); // Borrado de la carpeta temporal
                    res.redirect("/admin/apartments");
                });
            
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

        Apartment.findByPk(Number(req.params.id), {
            include : [
                {
                    model : Image,
                    attributes : ["url"]
                },
                {
                    model : Building,
                    attributes : ["id", "name"]
                }
            ]
        })
            .then(result => {
                res.render("admin/editApartment", {
                    apartment : result
                });
            });

    },

    /** Procesamiento de la vista de edición */
    update : (req, res) => {
        // TODO : Integrar el borrado de imágenes
        let errors = validationResult(req);
        let tempFilesDir = path.join(TEMP_DIRECTORY, req.body.name);

        if(errors.isEmpty()){

            let updated = {
                name : req.body.name,
                price : Number(req.body.price),
                initDate : req.body["init-date"],
                endDate : req.body["end-date"]
            }

            // Campos opcionales
            if(req.body.description != "")
                updated.description = req.body.description;
            if(req.files && req.files.doc)
                updated.documentUrl = req.files.doc[0].filename;
            
            Apartment.update(updated, {
                where : { id : Number(req.params.id) }
            })
                .then(() => {
                    // En caso de subida de imágenes
                    if(req.files && req.files.images){
                        let imagePromises = [];

                        req.files.images.forEach(element => {
                            imagePromises.push(Image.create({ 
                                url : element.filename,
                                apartmentId : Number(req.params.id)
                            }));
                        });

                        return Promise.all(imagePromises);
                    } else 
                        return Promise.resolve(false);
                })
                .then(results => {
                    if(results){
                        results.forEach(image => {
                            fs.renameSync(
                                path.join(tempFilesDir, "img", image.url),
                                path.join(IMG_DIRECTORY, image.url)
                            );
                        });
                    }

                    fs.rmdirSync(tempFilesDir, { recursive : true }); // Borrado de la carpeta temporal
                
                    // Aplicando casi la misma lógica, se resuelve el borrado de imágenes en caso de que se seleccionen
                    if(req.body["img-selected"]){
                        let imagePromises = [];
                        let images = req.body["img-selected"].split(",");
                        console.log(images);
                        images.forEach(element => {
                            imagePromises.push(Image.destroy({ where : { url : element } }));
                            // Borrado de las imágenes del disco
                            fs.unlinkSync(path.join(IMG_DIRECTORY, element));
                        });

                        return Promise.all(imagePromises);
                    } else 
                        return Promise.resolve();
                })
                .then(() => {
                    res.redirect("/admin/apartments");
                });

        } else {
            // TODO : Borrar los archivos temporales en caso de que se produzcan errores
            Apartment.findByPk(Number(req.params.id),{
                include : [
                    {
                        model : Image,
                        attributes : ["url"]
                    },
                    {
                        model : Building,
                        attributes : ["id", "name"]
                    }
                ]
            })
                .then(result => {
                    res.render("admin/editApartment",{
                        apartment : result,
                        errors : errors.mapped(),
                        userInput : {
                            description : req.body.description
                        }
                    });
                });
        }
    },

    /**
     * Borra un registro en la base de datos teniendo en cuenta sus asociaciones.
     */
    delete : async (req, res) => {
        let id = Number(req.params.id);

        try {
            
            let documentToDelete = await Apartment.findByPk(id, {
                attributes : ["documentUrl"]
            });

            let imagesToDelete = await Image.findAll({ 
                where : { apartmentId : id }
            });

            await sequelize.transaction(async (t) => { // Transacciones a BD
                await Image.destroy({
                    where : { apartmentId : id },
                }, { transaction : t });
                
                await Apartment.destroy({ 
                    where : { id : id }
                }, { transaction : t });
            });
            
            // Si se llega a ejecutar esta sección, significa que la transacción fue exitosa
            if(documentToDelete.documentUrl){ // Borrado del documento asociado al depto
                fs.unlinkSync(path.join(DOCS_DIRECTORY, documentToDelete.documentUrl));
            }

            if(imagesToDelete.length){ // Borrado de las imágenes del disco
                imagesToDelete.forEach(element => {
                    fs.unlinkSync(path.join(IMG_DIRECTORY, element.url));
                });
            }

            res.status(200).redirect("/admin/apartments");

        } catch (error) {
            // El Rollback es automático..
            // TODO : Mostrar algún feedback
            console.log(error);
            res.status(500).redirect("/");
        }

    },

    /**
     * Descarga del documento asociado 
     */
    download : (req, res) => {
        res.download(path.join(DOCS_DIRECTORY, req.params.doc), req.params.doc);
    }

}