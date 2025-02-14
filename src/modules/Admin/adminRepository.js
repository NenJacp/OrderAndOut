////////////////////////////////////////////////////////////
//          REPOSITORIO DE ADMINISTRADORES              ///
// Propósito: Abstacción de operaciones CRUD para Admin
// Métodos:
// - Búsquedas case-insensitive
// - Validación de existencia previa
// - Manejo seguro de actualizaciones
////////////////////////////////////////////////////////////

const Admin = require('./adminModel'); // Importar el modelo de administrador

// Función para crear un nuevo administrador
const createAdmin = async (adminData) => {
    const newAdmin = new Admin(adminData);
    return await newAdmin.save(); // Guardar en la base de datos
};

/**
 * @method getAdminByEmail
 * @desc Busca administrador por email (insensible a mayúsculas)
 * @param {String} email - Correo a buscar
 * @returns {Promise<Admin|null>} 
 * @throws {MongoError} - Errores de base de datos
 */
const getAdminByEmail = async (email) => {
    return await Admin.findOne({ 
        email: new RegExp(`^${email}$`, 'i') 
    });
};

// Función para obtener todos los administradores
const getAllAdmins = async () => {
    return await Admin.find(); // Obtener todos los administradores
};

// Función para obtener un administrador por ID
const getAdminById = async (id) => {
    return await Admin.findById(id); // Buscar administrador por ID
};

// Función para actualizar un administrador
const updateAdmin = async (id, adminData) => {
    return await Admin.findByIdAndUpdate(id, adminData, { new: true }); // Actualizar administrador
};

// Función para eliminar un administrador
const deleteAdmin = async (id) => {
    return await Admin.findByIdAndDelete(id); // Eliminar administrador
};

module.exports = {
    createAdmin,
    getAdminByEmail,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
