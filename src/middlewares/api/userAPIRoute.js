/**
 * Middleware para permitir el acceso a la API sólo a usuarios autenticados.
 */

module.exports = (req, res, next) => {
    if(req.session.building || req.session.admin){
        next();
    } else {
        res.status(401).json({
            meta : {
                status : 401,
                statusMsg : "Unauthorized request"
            }
        });
    }
}