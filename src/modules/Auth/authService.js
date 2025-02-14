const bcrypt = require('bcrypt');

// Función para hashear la contraseña
const hasher = async (password) => {
    return await bcrypt.hash(password, 10); // Hashear la contraseña con un factor de coste de 10
};

// Función para comparar contraseñas
const comparer = async (candidatePassword, storedPassword) => {
    return await bcrypt.compare(candidatePassword, storedPassword); // Comparar la contraseña candidata con la contraseña almacenada
};

// Exportar como objeto con métodos
module.exports = {
    hasher: async (password) => await bcrypt.hash(password, 10), // Método para hashear contraseñas
    comparer: async (candidatePassword, storedPassword) => await bcrypt.compare(candidatePassword, storedPassword) // Método para comparar contraseñas
}; 