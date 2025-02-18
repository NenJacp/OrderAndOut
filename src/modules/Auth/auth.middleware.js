const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
require('dotenv').config(); // Cargar variables de entorno

/**
 * Middleware para verificar el token de autenticación.
 * @param {string} req - Objeto de solicitud.
 * @param {string} res - Objeto de respuesta.
 * @const {NextFunction} next - Función para continuar con el flujo de la aplicación.
 */
const verifyToken = (req, res, next) => {

    /**
     * @description Obtener el encabezado de autenticación
     * @param {string} req - Objeto de solicitud.
     * @param {string} req.headers - Encabezados de la solicitud.
     * @param {string} req.headers.authorization - Encabezado de autenticación.
     * @const {string} authHeader - Encabezado de autenticación.
     */
    const authHeader = req.headers.authorization;
    
    /**
     * @description Si no hay un token, devolver un error
     * @param {string} authHeader - Encabezado de autenticación.
     * @param {string} authHeader.startsWith - Comprobar si el encabezado de autenticación comienza con 'Bearer '.
     * @returns {string} - Mensaje de error.
     */
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ code: 'MISSING_TOKEN', message: 'Formato Authorization: Bearer <token>' });
    }

    /**
     * @description Extracción del token de autenticación
     * @param {string} authHeader - Encabezado de autenticación.
     * @param {string} authHeader.split - Dividir el encabezado de autenticación en un array.
     * @param {string} authHeader.split[1] - Obtener el token de autenticación.
     * @const {string} token - Token de autenticación.
     */
    const token = authHeader.split(' ')[1];
    
    /**
     * @description Verificar y decodificar el token
     */
    try {

        /**
         * @description Decodificar el token
         * @param {string} token - Token de autenticación.
         * @param {string} process.env.JWT_SECRET - Clave secreta para el token.
         * @param {string} jwt.verify - Verificar el token.
         * @const {string} decoded - Token decodificado.
         */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        /**
         * @description Validar los campos esenciales del token
         * @param {string} decoded - Token decodificado.
         * @param {string} decoded.id - ID del usuario.
         * @param {string} decoded.type - Tipo de usuario.
         */
        if (!decoded.id || !decoded.type) {
            return res.status(403).json({ code: 'INVALID_TOKEN', message: 'Token mal formado' });
        }

        /**
         * @description Inyectar los datos del usuario autenticado en la solicitud
         * @param {string} req - Objeto de solicitud.
         * @param {string} req.user - Usuario autenticado.
         * @param {string} req.user.id - ID del usuario.
         * @param {string} req.user.type - Tipo de usuario.
         * @param {string} req.user.restaurant - Restaurante del usuario.
         */
        req.user = { id: decoded.id, type: decoded.type, restaurant: decoded.restaurant || null };
        
        /**
         * @description Continuar con el flujo de la aplicación
         */
        next();
    } catch (error) {

        /**
         * @description Manejo de errores específicos relacionados con el token
         * @param {string} error - Error.
         * @param {string} error.name - Nombre del error.
         * @param {string} error.expiredAt - Fecha de expiración del token.
         * @const {number} statusCode - Código de estado.
         */
        const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;

        /**
         * @description Mensaje de error
         * @param {string} error.expiredAt - Fecha de expiración del token.
         * @param {string} error.expiredAt.toISOString - Convertir la fecha de expiración a una cadena ISO.
         * @const {string} message - Mensaje de error.
         */
        const message = error.expiredAt 
            ? `Token expirado el ${error.expiredAt.toISOString()}`
            : 'Token inválido o manipulado';

        /**
         * @description Devolver un error
         * @param {string} statusCode - Código de estado.
         * @param {string} message - Mensaje de error.
         * @returns {string} - Mensaje de error.
         */
        res.status(statusCode).json({ code: 'INVALID_TOKEN', message });
    }
};

/**
 * Middleware para verificar token de desarrollador
 * @param {string} req - Objeto de solicitud.
 * @param {string} res - Objeto de respuesta.
 * @const {NextFunction} next - Función para continuar el flujo.
 */
const verifyDeveloperToken = (req, res, next) => {
    
    /**
     * @description Verificar el token
     * @param {string} req - Objeto de solicitud.
     * @param {string} res - Objeto de respuesta.
     * @param {string} next - Función para continuar el flujo.
     */
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        
        /**
         * @description Validar el tipo de usuario
         * @param {string} req - Objeto de solicitud.
         * @param {string} req.user - Usuario autenticado.
         * @param {string} req.user.type - Tipo de usuario.
         * @returns {string} - Mensaje de error.
         */
        if (req.user.type !== 'developer') {
            return res.status(403).json({ code: 'DEVELOPER_ACCESS_REQUIRED', message: 'Acceso exclusivo para desarrolladores' });
        }
        
        /**
         * @description Continuar con el flujo de la aplicación
         */
        next();
    });
};

/**
 * @description Exportar las funciones de autenticación
 * @returns {object} - Funciones de autenticación.
 */
module.exports = {
    verifyToken,
    verifyDeveloperToken
}; 