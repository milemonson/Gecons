/**
 * CRUD para el endpoint de la API HTTP encargado de las operaciones relacionadas a la entidad Building.
 */
const fs = require("fs");
const path  = require("path");
const { Building, Apartment, Image, Document, sequelize } = require("../../database/models");
const { Op } = require("sequelize");

const LIMIT_PER_PAGE = 10;
const DOCS_DIRECTORY = path.join(__dirname, ".." , "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, ".." , "..", "..", "public", "img", "uploaded");

module.exports = {

    /**
     * Retorna un listado de los edificios registrados teniendo en cuenta el paginado.
     */
    listAll : (req, res) => {

        const page = Number(req.query.page) || 1;
        const response = {
            meta : {},
            data : []
        }; // Respuesta JSON

        Building.findAll({
            where : {
                name : {
                    [Op.like] : `${req.query.filter}%`
                }
            },
            attributes : ["id", "name"],
            include : Apartment,
            limit : LIMIT_PER_PAGE,
            offset : (page - 1) * LIMIT_PER_PAGE
        })
            .then(result => {

                response.meta = {
                    status : 200,
                    statusMsg : "Ok",
                    count : result.length,
                    page : page
                }
                
                // TODO : ver cómo traer la cantidad de departamentos en vez
                // de traermelos todos
                response.data = result.map(element => {
                    return {
                        "id" : element.id,
                        "name" : element.name,
                        "apartments" : element.Apartments.length
                    }
                });

                res.status(200).json(response);
            },
            // Rechazo de la petición
            reject => {throw new Error(reject)})
            .catch(error => {
                console.log(error);
                response.meta.status = 500;
                response.meta.statusMsg = "Internal server error";
                
                res.json(response);
            });

    },

    /**
     * Retorna el total de páginas.
     */
    getPages : (req, res) => {
        
        Building.count({
            where : {
                name : {
                    [Op.like] : `${req.query.filter}%`
                }
            },
        })
            .then(count => {
                res.status(200).json({
                    meta : {
                        status : 200,
                        statusMsg : "Ok",
                        count : Math.ceil(count / LIMIT_PER_PAGE)
                    }
                })
            },
            // Rechazo de la petición
            reject => {throw new Error(reject)})
            .catch(error => {
                response.meta.status = 500;
                response.meta.statusMsg = "Internal server error";
                
                res.status(500).json(response);
            });
    },

    /**
     * Retorna todos los edificios sin formato de lista
     */
    getBuildings : (req, res) => {

        Building.findAll({ attributes : ["name", "id"] })
            .then(result => {
                res.status(200).json({
                    meta : {
                        status : 200,
                        statusMsg : "Ok",
                        count : result.length
                    },
                    data : result
                });
            },
            // Rechazo de la petición
            reject => {throw new Error(reject)})
            .catch(error => {
                response.meta.status = 500;
                response.meta.statusMsg = "Internal server error";
                
                res.status(500).json(response);
            });

    },

    /**
     * Borra un registro en la base de datos teniendo en cuenta sus asociaciones.
     */
    delete : async (req, res) => {

        let apartmentIDs; // IDs de los departamentos para el borrado de archivos
        let imagesToDelete = [];
        let documentsToDelete = [];
        const buildingId = Number(req.params.id);

        let apartmentsToDelete = await Apartment.findAll({
            attributes : ["id"],
            include : [
                {
                    model : Image,
                    attributes : ["url"]
                },
                {
                    model : Document,
                    attributes : ["url"]
                }
            ],
            where : {
                buildingId : buildingId
            }
        });

        if(apartmentsToDelete.length){
            apartmentIDs = apartmentsToDelete.map(value => {

                if(value.Documents.length){ // Nombre de los documentos para su borrado en disco
                    value.Documents.forEach(doc => {
                        documentsToDelete.push(doc.url);
                    });
                }

                if(value.Images.length){ // Nombre de las imágenes para su borrado en disco
                    value.Images.forEach(img => {
                        imagesToDelete.push(img.url);
                    });
                }

                return value.id;
            });
        }

        try {
            // Transacción en cascada para borrar todos los registros asociados al edificio
            await sequelize.transaction(async (t) => {
                if(apartmentIDs){
                    await Document.destroy({
                        where : { apartmentId : apartmentIDs }
                    }, { transaction : t });

                    await Image.destroy({
                        where : { apartmentId : apartmentIDs }
                    }, { transaction : t });

                    await Apartment.destroy({
                        where : { buildingId : buildingId }
                    }, { transaction : t });
                }

                await Building.destroy({
                    where : { id : buildingId }
                }, { transaction : t });
            });

            // Si se llega a ejecutar esta sección, significa que la transacción fue exitosa
            if(documentsToDelete.length){
                documentsToDelete.forEach(doc => {
                    fs.unlinkSync(path.join(DOCS_DIRECTORY, doc));
                });
            }
            if(imagesToDelete.length){
                imagesToDelete.forEach(img => {
                    fs.unlinkSync(path.join(IMG_DIRECTORY, img));
                });
            }

            res.status(204).json();

        } catch (error) {
            res.status(500).json({
                meta : {
                    status : 500,
                    statusMsg : "Internal server error"
                }
            });
        }
    }

}