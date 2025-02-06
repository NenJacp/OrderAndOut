////////////////////////////////////////////////////////////
//                     Auth Middleware                   ///
////////////////////////////////////////////////////////////

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Asegurar la estructura correcta del usuario
        req.user = { 
            id: decoded.id.toString(),  // Convertir a string por si es ObjectId
            type: decoded.type 
        };
        
        console.log('Usuario autenticado:', req.user); // Debug
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = verifyToken; 