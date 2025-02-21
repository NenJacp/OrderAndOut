const bcrypt = require('bcrypt'); // Importar bcrypt
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken

/**
 * @description Hashear la contraseña
 * @param {string} password
 * @returns {Promise<string>}
 */
const hasher = async (password) => {
    return await bcrypt.hash(password, 10); // Hashear la contraseña con un factor de coste de 10
};

/**
 * @description Comparar la contraseña candidata con la contraseña almacenada
 * @param {string} candidatePassword
 * @param {string} storedPassword
 * @returns {Promise<boolean>}
 */
const comparer = async (candidatePassword, storedPassword) => {
    return await bcrypt.compare(candidatePassword, storedPassword); // Comparar la contraseña candidata con la contraseña almacenada
};

/**
 * @description Generar un código de verificación aleatorio
 * @returns {string}
 */
const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
};

/**
 * @description Generar un token de autenticación para un administrador
 * @param {Object} payload
 * @returns {string}
 */
const generateAdminAuthToken = (payload) => {
    return jwt.sign(
        {
            id: payload.id,
            type: payload.type,
            restaurant: payload.restaurant || null
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );
};

/**
 * @description Generar un token de autenticación para un kiosco
 * @param {Object} payload
 * @param {string} duration
 * @returns {string}
 */
const generateKioscoAuthToken = (payload, duration) => {
    const options = {};
    
    if (duration && duration !== 'none') {
        options.expiresIn = duration;
    }
    
    return jwt.sign(
        {
            id: payload.id,
            type: payload.type,
            restaurant: payload.restaurant || null
        },
        process.env.JWT_SECRET,
        options
    );
};

/**
 * @description Verificar un token
 * @param {string} token
 * @returns {Object}
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw { 
            name: error.name, 
            message: error.message,
            expiredAt: error.expiredAt 
        };
    }
};

/**
 * @description Exportar como objeto con métodos
 * @returns {Object}
 */
module.exports = {
    hasher,
    comparer,
    generateCode,
    generateAdminAuthToken,
    generateKioscoAuthToken,
    verifyToken
};