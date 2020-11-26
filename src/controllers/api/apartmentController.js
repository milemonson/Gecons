/**
 * CRUD para el endpoint de la API HTTP encargado de las operaciones relacionadas a la entidad Apartment.
 */

const { Apartment } = require("../../database/models");
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
     * Borra un registro en la base de datos teniendo en cuenta sus asociaciones.
     */
    delete : (req, res) => {

        // TODO : Destruir carpetas, imágenes, etc...
        Apartment.destroy({ where :{ id : Number(req.params.id) } })
            .then(() => {
                res.status(204).json();
            },
            // Rechazo de la creación
            reject => {throw new Error(reject)})
            .catch(error => {
                console.log(error);
                // TODO : encontrar una forma más específica de informar el error....
                res.status(500).json({
                    meta : {
                        status : 500,
                        statusMsg : "Internal server error"
                    }
                });
            });
    }

}