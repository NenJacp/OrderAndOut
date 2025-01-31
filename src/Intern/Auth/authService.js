////////////////////////////////////////////////////////////
//                     Auth Service                      ///
////////////////////////////////////////////////////////////

const bcrypt = require('bcrypt');
//                  CONTRASEÑAS
// Función para hashear la contraseña
const hasher = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Función para comparar contraseñas
const comparer = async (candidatePassword, storedPassword) => {
    return await bcrypt.compare(candidatePassword, storedPassword);
};

module.exports = {
    hasher,
    comparer,
}; 