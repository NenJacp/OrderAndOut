const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @description Generar un código de verificación aleatorio
 * @returns {string}
 */
const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
};

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
 * @description Exportar como objeto con métodos
 * @returns {Object}
 */
module.exports = {
    hasher,
    comparer,
    generateCode,
    generateAdminAuthToken
};