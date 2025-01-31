////////////////////////////////////////////////////////////
//                     Auth Middleware                   ///
////////////////////////////////////////////////////////////

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        req.userId = decoded.id; // Establecer el ID del usuario en req.userId
        req.userType = decoded.type; // Establecer el tipo de usuario en req.userType

        // Eliminar la lógica de restaurantId
        // if (decoded.type !== 'admin') {
        //     req.restaurantId = decoded.restaurantId; // Establecer el ID del restaurante en req.restaurantId
        // }

        next();
    });
};

module.exports = verifyToken; 