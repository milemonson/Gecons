/**
 * Middleware para permitir el acceso a la API sólo a usuarios de tipo administrador.
 */

module.exports = (req, res, next) => {
    if(req.session.admin){
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