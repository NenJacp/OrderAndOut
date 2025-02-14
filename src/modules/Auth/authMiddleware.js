////////////////////////////////////////////////////////////
//           MIDDLEWARE DE AUTENTICACIÓN JWT             ///
// Funcionalidad:
// - Verifica token en header Authorization
// - Inyecta user context en requests
// - Manejo centralizado de errores de token
// Seguridad:
// - Usa algoritmo HS256 por defecto
// - Secret almacenado en variables de entorno
////////////////////////////////////////////////////////////

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

/**
 * @middleware verifyToken
 * @desc Verifica token JWT y extrae datos de usuario
 * @param {Object} req - Objeto de solicitud
 * @header {string} Authorization - Token JWT (Bearer format)
 * @property {Object} req.user - Datos de usuario decodificados
 * @throws {401} - Token no proporcionado o inválido
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Validación básica del header
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ 
            code: 'MISSING_TOKEN', 
            message: 'Formato Authorization: Bearer <token>' 
        });
    }

    // Extracción y verificación del token
    const token = authHeader.split(' ')[1];
    
    try {
        // Verificar y decodificar
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Inyectar datos de usuario
        req.user = {
            id: decoded.id,
            type: decoded.type, // 'admin' o 'kiosk'
            restaurant: decoded.restaurant || null
        };
        
        console.log('Usuario autenticado:', req.user); // Debug
        next();
    } catch (error) {
        // Manejar errores específicos
        const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
        const message = error.expiredAt 
            ? `Token expirado el ${error.expiredAt.toISOString()}`
            : 'Token inválido o manipulado';
        
        res.status(statusCode).json({
            code: 'INVALID_TOKEN',
            message
        });
    }
};

module.exports = verifyToken; 