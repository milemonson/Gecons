/**
 * Middleware que permite el acceso sólo a usuarios no autenticados. 
 */

module.exports = (req, res, next) => {
    if(req.session.building || req.session.admin){
        res.redirect("/");
    } else {
        next();
    }
}