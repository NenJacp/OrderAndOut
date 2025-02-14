const Admin = require('./adminModel'); // Importar el modelo de administrador

// Función para crear un nuevo administrador
const createAdmin = async (adminData) => {
    // Crear un nuevo administrador con los datos proporcionados
    const newAdmin = new Admin(adminData);
    // Guardar el nuevo administrador en la base de datos
    return await newAdmin.save();
};

// Función para obtener un administrador por correo electrónico
const getAdminByEmail = async (email) => {
    // Buscar un administrador por correo electrónico, sin importar mayúsculas o minúsculas
    return await Admin.findOne({ 
        email: new RegExp(`^${email}$`, 'i') 
    });
};

// Función para obtener todos los administradores
const getAllAdmins = async () => {
    // Obtener todos los administradores de la base de datos
    return await Admin.find();
};

// Función para obtener un administrador por ID
const getAdminById = async (id) => {
    // Buscar un administrador por su ID
    return await Admin.findById(id);
};

// Función para actualizar un administrador
const updateAdmin = async (id, adminData) => {
    // Actualizar un administrador por su ID, devolviendo el administrador actualizado
    return await Admin.findByIdAndUpdate(id, adminData, { new: true });
};

// Función para eliminar un administrador
const deleteAdmin = async (id) => {
    // Eliminar un administrador por su ID
    return await Admin.findByIdAndDelete(id);
};

// Exportar las funciones para su uso en otros módulos
module.exports = {
    createAdmin,
    getAdminByEmail,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
