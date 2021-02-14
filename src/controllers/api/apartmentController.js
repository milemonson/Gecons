/**
 * CRUD para el endpoint de la API HTTP encargado de las operaciones relacionadas a la entidad Apartment.
 */
const fs = require("fs");
const path = require("path");
const { Apartment, Document, Image } = require("../../database/models");

const TEMP_DIRECTORY = path.join(__dirname, "..", "..", "..", "tmp");
const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "..", "public", "img", "uploaded");
const LIMIT_PER_PAGE = 10;

module.exports = {

    /**
     * Retorna un listado de los departamentos de un edificio teniendo en cuenta 
     * el paginado y el edificio al que pertenecen los departamento.
     */
    listAll : (req, res) => {

        let page = Number(req.query.page);
        let fromBuilding = Number(req.query.b); // ID del edificio

        let response = {
            meta : {},
            data : []
        }; // Respuesta JSON

        Apartment.findAll({
            attributes : ["id", "name", "initDate", "endDate", "createdAt", "price"],
            where : {
                buildingId : fromBuilding
            },
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
                response.data = result;

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
     * Retorna el total de páginas teniendo en cuenta el edificio.
     */
    getPages : (req, res) => {

        let fromBuilding = Number(req.query.b); // ID del edificio

        Apartment.count({
            where : { buildingId : fromBuilding }
        })
            .then(count => {
                res.status(200).json({
                    meta : {
                        status : 200,
                        statusMsg : "Ok",
                        count : Math.ceil(count / LIMIT_PER_PAGE)
                    }
                });
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
     * Subida de archivos a través de fetch.
     */
    uploadFile : (req, res) => {
        
        const filename = req.files.images ? req.files.images[0].filename : req.files.doc[0].filename;

        res.status(200).json({
            meta : {
                status : 200,
                statusMsg : "Ok",
            },
            data : {
                filename : filename
            }
        });

    },

    /**
     * Borrado de archivos temporales descartados. 
     */
    deleteTempFiles : (req, res) => {

        const filesToDelete = req.body.deleteString.split(",");
        filesToDelete.forEach(file => {
            fs.unlinkSync(path.join(TEMP_DIRECTORY, file));
        });
        
        res.status(204).json();

    },

    /**
     * Borrado de documentos ya asociados en BD.
     */
    deleteDocument : async (req, res) => {
        const id = Number(req.query.id);

        await Document.destroy({ where : { id : id } });
        fs.unlinkSync(path.join(DOCS_DIRECTORY, req.query.doc));

        res.status(200).json({
            meta : {
                status : 200,
                statusMsg : "Ok"
            }
        });

    },

    /**
     * Borrado de imágenes ya asociadas en BD.
     */
    deleteImage : async (req, res) => {
        const id = Number(req.query.id);

        await Image.destroy({ where : { id : id} });
        fs.unlinkSync(path.join(IMG_DIRECTORY, req.query.url));

        res.status(200).json({
            meta : {
                status : 200,
                statusMsg : "Ok"
            }
        });

    }

}