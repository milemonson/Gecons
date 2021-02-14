const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const { Building, Apartment, Image, Document, sequelize } = require("../database/models");

const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "public", "img", "uploaded");
const TEMP_DIRECTORY = path.join(__dirname, "..", "..", "tmp");

module.exports = {

    /** Listado de todos los departamentos */
    show : (req, res) => {
        res.render("admin/apartments",{ buildingId : Number(req.params.bId) });
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
                    model : Document,
                    attributes : ["id", "url"]
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
    store : async (req, res) => {
        
        // TODO : Validar los archivos subidos
        let errors = validationResult(req);
        
        if(errors.isEmpty()){
            const createdAt = new Date().toISOString().substring(0, 10);

            let newApartment = {
                name : req.body.name,
                price : Number(req.body.price),
                initDate : req.body["init-date"],
                endDate : req.body["end-date"],
                buildingId : req.body.buildingId,
                createdAt : createdAt
            }

            if(req.body.description != "")
                newApartment.description = req.body.description;
            
            let created = await Apartment.create(newApartment);

            // Asociación de archivos subidos
            if(req.body["associated-docs"]){
                let docs = req.body["associated-docs"].split(",");
                // Creacion de los registros en un sólo INSERT
                let newDocs = docs.map(value => {
                    return {
                        url : value,
                        apartmentId : created.id
                    }
                });

                await Document.bulkCreate(newDocs);

                // Movida de archivos de la carpeta temporal
                docs.forEach(doc => {
                    fs.renameSync(
                        path.join(TEMP_DIRECTORY, doc),
                        path.join(DOCS_DIRECTORY, doc)
                    );
                });
            }

            if(req.body["associated-images"]){
                let images = req.body["associated-images"].split(",");

                let newImages = images.map(value => {
                    return {
                        url : value,
                        apartmentId : created.id
                    }
                });

                await Image.bulkCreate(newImages);

                images.forEach(image => {
                    fs.renameSync(
                        path.join(TEMP_DIRECTORY, image),
                        path.join(IMG_DIRECTORY, image)
                    );
                });
            }

            res.redirect(`/admin/apartments/list/${req.body.buildingId}`);
            
        } else { // En caso de errores, se descartan los archivos de la carpeta temporal
            if(req.body["associated-docs"]){
                req.body["associated-docs"].split(",").forEach(doc => {
                    fs.unlinkSync(path.join(TEMP_DIRECTORY, doc));
                });
            }
            if(req.body["associated-images"]){
                req.body["associated-images"].split(",").forEach(image => {
                    fs.unlinkSync(path.join(TEMP_DIRECTORY, image));
                });
            }

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
                    attributes : ["id", "url"]
                },
                {
                    model : Document,
                    attributes : ["id", "url"]
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
    update : async (req, res) => {
        
        const id = Number(req.params.id);
        const errors = validationResult(req);

        if(errors.isEmpty()){

            let updated = {
                name : req.body.name,
                price : Number(req.body.price),
                initDate : req.body["init-date"],
                endDate : req.body["end-date"]
            }

            if(req.body.description != "")
                updated.description = req.body.description;
            
            await Apartment.update(updated, {
                where : { id : Number(req.params.id) }
            });

            if(req.body["associated-docs"]){
                let docs = req.body["associated-docs"].split(",");
                // Creacion de los registros en un sólo INSERT
                let newDocs = docs.map(value => {
                    return {
                        url : value,
                        apartmentId : id
                    }
                });

                await Document.bulkCreate(newDocs);

                // Movida de archivos de la carpeta temporal
                docs.forEach(doc => {
                    fs.renameSync(
                        path.join(TEMP_DIRECTORY, doc),
                        path.join(DOCS_DIRECTORY, doc)
                    );
                });
            }

            if(req.body["associated-images"]){
                let images = req.body["associated-images"].split(",");

                let newImages = images.map(value => {
                    return {
                        url : value,
                        apartmentId : id
                    }
                });

                await Image.bulkCreate(newImages);

                images.forEach(image => {
                    fs.renameSync(
                        path.join(TEMP_DIRECTORY, image),
                        path.join(IMG_DIRECTORY, image)
                    );
                });
            }

            // TODO: Enviar a la vista de "completado"
            res.redirect("/admin/buildings");

        } else {
            // Borrado de los archivos temporales
            if(req.body["associated-docs"]){
                req.body["associated-docs"].split(",").forEach(doc => {
                    fs.unlinkSync(path.join(TEMP_DIRECTORY, doc));
                });
            }
            if(req.body["associated-images"]){
                req.body["associated-images"].split(",").forEach(image => {
                    fs.unlinkSync(path.join(TEMP_DIRECTORY, image));
                });
            }

            let apartment = await Apartment.findByPk(Number(req.params.id),{
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

            res.render("admin/editApartment",{
                apartment : apartment,
                errors : errors.mapped(),
                userInput : {
                    description : req.body.description
                }
            });
        }
    },

    /**
     * Borra un registro en la base de datos teniendo en cuenta sus asociaciones.
     */
    delete : async (req, res) => {
        let id = Number(req.params.id);

        try {
            
            let documentsToDelete = await Document.findAll({
                where : { apartmentId : id }
            });

            let imagesToDelete = await Image.findAll({ 
                where : { apartmentId : id }
            });

            await sequelize.transaction(async (t) => { // Transacciones a BD
                await Document.destroy({
                    where : { apartmentId : id }
                }, { transaction : t });

                await Image.destroy({
                    where : { apartmentId : id }
                }, { transaction : t });
                
                await Apartment.destroy({ 
                    where : { id : id }
                }, { transaction : t });
            });
            
            // Si se llega a ejecutar esta sección, significa que la transacción 
            // tuvo éxito y se pueden borrar los archivos del disco
            if(documentsToDelete.length){
                documentsToDelete.forEach(element => {
                    fs.unlinkSync(path.join(DOCS_DIRECTORY, element.url));
                });
            }

            if(imagesToDelete.length){
                imagesToDelete.forEach(element => {
                    fs.unlinkSync(path.join(IMG_DIRECTORY, element.url));
                });
            }
            
            res.redirect("/admin/buildings");

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