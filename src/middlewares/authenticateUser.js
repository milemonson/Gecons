/**
 * Middleware para insertar en res.locals a las variables en sesión.
 */
const { Admin, Token } = require("../database/models");

module.exports = (req, res, next) => {

    if(req.session.building){
        res.locals.building = req.session.building;
        next();
    }
    else if(req.session.admin){
        res.locals.admin = req.session.admin;
        next();
    }
    else if(req.cookies.uTGC){ // Checkeo de cookies
        Token.findOne({
            where : { token : req.cookies.uTGC }
        })
        .then(token => {
            Admin.findByPk(Number(token.adminId))
                .then(result => {
                    delete result.password;
                    req.session.admin = result;
                    res.locals.admin = result;

                    next();
                });
        })
        .catch(error => { // Borrado de cookies inválidas
            console.log(error);
            res.clearCookie("uTGC");
            next();
        });
    } else {
        next();
    }

}