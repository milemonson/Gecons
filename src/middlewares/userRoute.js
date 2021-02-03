/**
 * Middleware que permite el acceso sólo a usuarios logueados.
 */

module.exports = (req, res, next) => {
    if(req.session.building || req.session.admin){
        next();
    } else {
        res.redirect("/login");
    }
}