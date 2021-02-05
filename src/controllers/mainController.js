const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendMail } = require("../utils/sendMail");
const { validationResult } = require("express-validator");
const { Admin, Building, Token } = require("../database/models");

module.exports = {

    index : (req, res) => {
        res.sendFile(path.join(__dirname, "..", "views", "main", "index.html"));
    },

    // Formulario de login
    login : (req, res) => {
        res.render("main/login");
    },

    // Autenticación del login
    authenticate : async (req, res) => {

        let errors = validationResult(req);

        if(errors.isEmpty()){

            let building = await Building.findOne({ 
                where : {
                    name : req.body.user
                } 
            });
            
            // Si el nombre corresponde a un edificio
            if(building && bcrypt.compareSync(req.body.password, building.password)){
                building = { // Elimina la metadata insertada en el objeto creado por sequelize
                    id : building.id,
                    name : building.name
                }
                req.session.building = building;
            } else {
                let admin = await Admin.findOne({
                    where : {
                        name : req.body.user
                    }
                });
                
                if(admin && bcrypt.compareSync(req.body.password, admin.password)){
                    admin = {
                        id : admin.id,
                        name : admin.name
                    }
                    req.session.admin = admin;
                } else {
                    // Mensaje de error en el formato que usa express-validator
                    return res.render("main/login", {
                        errors : { 
                            authenticate : { msg : "Usuario ó contraseña incorrecta" }
                        }
                    });
                }
            }

            // "Recordarme" y cookies
            if(req.body["remember-me"] == "remember-me" && req.session.admin){
                const token = crypto.randomBytes(48).toString("base64");

                await Token.create({
                    adminId : req.session.admin.id,
                    token : token
                });

                // Almacena el Token en la cookie por un mes
                res.cookie("uTGC", token, {maxAge : 1000 * 60 * 60 * 24 * 30});
            }

            // Redireccionamiento según se es admin ó edificio
            if(building){
                return res.redirect("/admin/apartments");
            }
            else{
                res.redirect("/admin/buildings");
            }

        } else {
            res.render("main/login", {
                userInput : { name : req.body.user },
                errors : errors.mapped()
            });
        }
    },

    logout : (req, res) => {
        
        if(req.session.admin){
            Token.destroy({
                where : {
                    adminId : req.session.admin.id
                }
            });

            res.clearCookie("uTGC");
        }

        req.session.destroy();

        res.redirect("/");
    },

    // Envío de mails desde el formulario de contacto del index
    contactMail : (req, res) => {
        const { email, subject, phone, name, message } = req.body;

        const mail = {
            from : "no-reply@gecons.ar",
            to : email,
            subject : subject,
            body : `${name} \n${phone} \n${message}`
        }

        // TODO : Atajar el error de envío de mails
        sendMail(mail)
            .then(() => {
                res.redirect("/");
            })
            .catch(error => {
                console.log(error);
            });
    },

    // Envío de mails desde la sección de creación de departamentos
    apartmentMail : (req, res) => {
        // TODO : Codear el envío de mails desde la vista de departamentos después del despliegue
    }

}