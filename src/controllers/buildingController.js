const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Building } = require("../database/models");

const SALT_NUMBER = 12;

module.exports = {

    /** Listado de todos los edificios registrados */
    show : (req, res) => {
        res.render("admin/buildings");
    },

    /** Vista de creación de un nuevo edificio */
    create : (req, res) => {
        res.render("admin/addBuilding");
    },

    /** Procesamiento de la creación de un edificio */
    store : (req, res) => {
        let errors = validationResult(req);

        if(errors.isEmpty()){
            
            let newBuilding = {
                name : req.body.name,
                password : bcrypt.hashSync(req.body.password, SALT_NUMBER)
            }

            Building.create(newBuilding)
                // TODO : Procesar el mail
                .then(() => {
                    res.redirect("/admin/buildings");
                });
                // TODO : Atajar el error

        } else {
            res.render("admin/addBuilding", {
                errors : errors.mapped(),
                userInput : {
                    name : req.body.name,
                    "send-to" : req.body["send-to"]
                }
            });
        }
    },

    /** Edición de un edificio existente */
    edit : (req, res) => {

        Building.findByPk(req.params.id, { attributes : ["id", "name"]})
            .then(editable => {
                res.render("admin/editBuilding", {
                    editable : editable
                });
            })
    },

    /** Procesamiento de la edición de un edificio existente */
    update : async (req, res) => {
        const id = Number(req.params.id);
        const errors = validationResult(req).mapped();

        // Validaciones que requieren acceso a la base de datos
        if(!errors.name){
            let old = await Building.findOne({ 
                attributes : ["id"],
                where : { name : req.body.name } 
            });
            // El nombre puede coincidir con el anterior, pero no con el de otro edificio
            if(old && old.id != id) {
                errors.name = {
                    msg : "Nombre del edificio en uso."
                }
            }
        }

        if(!errors.oldPassword){
            let old = await Building.findByPk(id, { attributes : ["password"] });
            if(!bcrypt.compareSync(req.body.oldPassword, old.password)){
                errors.oldPassword = {
                    msg : "Contraseña incorrecta."
                }
            }
        }

        if(Object.keys(errors).length === 0){ // Si no hay errores
            let updated = { name : req.body.name }

            if(req.body.password && req.body.password != ""){
                updated.password = bcrypt.hashSync(req.body.password, SALT_NUMBER);
            }

            // TODO : Procesar el mail
            await Building.update(updated, { 
                where : { id : id } 
            });

            res.redirect("/admin/buildings");

        } else {
            const editable = await Building.findByPk(req.params.id, {attributes : ["id", "name"]});

            res.render("admin/editBuilding", {
                errors : errors,
                editable : editable,
                userInput : {
                    "send-to" : req.body["send-to"]
                }
            })
        }
    }

}