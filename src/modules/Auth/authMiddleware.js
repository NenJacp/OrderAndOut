const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

/**
 * Middleware para verificar el token de autenticación.
 * @param {NextFunction} next - Función para continuar con el flujo de la aplicación.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Validación básica del header de autenticación
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ 
            code: 'MISSING_TOKEN', 
            message: 'Formato Authorization: Bearer <token>' 
        });
    }

    // Extracción del token de autenticación
    const token = authHeader.split(' ')[1];
    
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Añadir validación de campos esenciales
        if (!decoded.id || !decoded.type) {
            return res.status(403).json({
                code: 'INVALID_TOKEN',
                message: 'Token mal formado'
            });
        }

        // Validar estructura del token para administradores
        if (decoded.type === 'admin' && !decoded.restaurant) {
            return res.status(403).json({
                code: 'RESTAURANT_REQUIRED',
                message: 'El administrador no tiene restaurante asignado'
            });
        }

        // Inyectar los datos del usuario autenticado en la solicitud
        req.user = {
            id: decoded.id,
            type: decoded.type, // 'admin' o 'kiosk'
            restaurant: decoded.restaurant || null
        };
        
        console.log('Usuario autenticado:', req.user); // Debug
        next();
    } catch (error) {
        // Manejo de errores específicos relacionados con el token
        const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
        const message = error.expiredAt 
            ? `Token expirado el ${error.expiredAt.toISOString()}`
            : 'Token inválido o manipulado';
        
        res.status(statusCode).json({
            code: 'INVALID_TOKEN',
            message: 'Token inválido o manipulado'
        });
    }
};

module.exports = verifyToken; 