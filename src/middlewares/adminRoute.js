/**
 * Middleware que permite el acceso sólo a usuarios administradores. 
 */

module.exports = (req, res, next) => {
    if(req.session.admin){
        next();
    } else {
        res.redirect("/login");
    }
}