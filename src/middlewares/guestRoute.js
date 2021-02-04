/**
 * Middleware que permite el acceso sólo a usuarios no autenticados. 
 */

module.exports = (req, res, next) => {
    if(req.session.building ){
        res.redirect("/admin/apartments");
    } else if(req.session.admin) {
        res.redirect("/admin/buildings");
    } else {
        next();
    }
}