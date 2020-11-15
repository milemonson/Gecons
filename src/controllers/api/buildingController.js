/**
 * CRUD para el endpoint de la API HTTP encargado de las operaciones relacionadas a la entidad Building.
 */

const { Building, Apartment } = require("../../database/models");
const LIMIT_PER_PAGE = 10;

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
                console.log(error);
                response.meta.status = 500;
                response.meta.statusMsg = "Internal server error";
                
                res.json(response);
            });
    },

    /**
     * Detalle de un Edificio según su ID
     */
    detail : (req, res) => {

    },

    /**
     * Crea un nuevo registro en la base de datos.
     */
    create : (req, res) => {

        let newBuilding = {
            name : req.body.name,
            password : req.body.password
        }

        Building.create(newBuilding)
            .then(created => {
                if(created) res.status(204).json();
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
    },

    /**
     * Borra un registro en la base de datos teniendo en cuenta sus asociaciones.
     */
    delete : (req, res) => {

        // Destroy provisional: En un futuro va a haber que tener en cuenta todos
        // los registros asociados a el edificio y borrarlos en una sola transacción...
        Building.destroy({ where :{ id : Number(req.params.id) } })
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

    },

    /**
     * Cambia parcial ó totalmente un registro existente.
     */
    update : (req, res) => {

    }

}