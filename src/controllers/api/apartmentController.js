/**
 * CRUD para el endpoint de la API HTTP encargado de las operaciones relacionadas a la entidad Apartment.
 */
const fs = require("fs");
const path = require("path");
const { Apartment, Building, Image, sequelize } = require("../../database/models");

const LIMIT_PER_PAGE = 10;
const DOCS_DIRECTORY = path.join(__dirname, "..", "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, "..", "..", "..", "public", "img", "uploaded");

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
            attributes : ["id", "name", "initDate", "endDate", "price"],
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
     * Descarga del documento asociado 
     */
    downloadDocument : (req, res) => {
        // TODO : Resolver la descarga del documento
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

            res.status(204).json();

        } catch (error) {
            // El Rollback es automático..
            res.status(500).json({
                meta : {
                    status : 500,
                    statusMsg : "Internal server error"
                }
            });
        }
    }

}