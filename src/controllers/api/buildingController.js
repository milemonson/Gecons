/**
 * CRUD para el endpoint de la API HTTP encargado de las operaciones relacionadas a la entidad Building.
 */
const fs = require("fs");
const path  = require("path");
const { Building, Apartment, Image, sequelize } = require("../../database/models");

const LIMIT_PER_PAGE = 10;
const DOCS_DIRECTORY = path.join(__dirname, ".." , "..", "..", "docs");
const IMG_DIRECTORY = path.join(__dirname, ".." , "..", "..", "public", "img", "uploaded");

module.exports = {

    /**
     * Retorna un listado de los edificios registrados teniendo en cuenta el paginado.
     */
    listAll : (req, res) => {

        let page = Number(req.query.page) || 1;
        let response = {
            meta : {},
            data : []
        }; // Respuesta JSON

        Building.findAll({
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
        
        Building.count()
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

        let apartmentIDs; // IDs de los departamentos para el borrado de imágenes
        const buildingId = Number(req.params.id);

        let toDelete = await Building.findByPk(
            buildingId, {
                attributes : ["name"],
                include : {
                    model : Apartment,
                    attributes : ["id"]
                }
            }
        );

        if(toDelete.Apartments.length != 0){
            apartmentIDs = toDelete.Apartments.map(value => {
                return value.id;
            });
        }

        try {
            // Transacción en cascada para borrar todos los registros asociados al edificio
            await sequelize.transaction(async (t) => {
                if(apartmentIDs){
                    await Image.destroy({
                        where : { apartmentId : apartmentIDs }
                    }, { transaction : t });
                }

                await Apartment.destroy({
                    where : { buildingId : buildingId }
                }, { transaction : t });

                await Building.destroy({
                    where : { id : buildingId }
                }, { transaction : t });
            });

            // Borrado recursivo de las carpetas asociadas
            fs.rmdirSync(path.join(DOCS_DIRECTORY, toDelete.name), { recursive : true });
            fs.rmdirSync(path.join(IMG_DIRECTORY, toDelete.name), { recursive : true });

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