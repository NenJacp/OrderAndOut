const Admin = require('./admin.model'); // Importar el modelo de administrador

/**
 * @description Crear un nuevo administrador
 * @param {object} adminData
 * @returns {Promise<object>}
 */
const createAdmin = async (adminData) => {

    /**
     * @description Crear un nuevo administrador con los datos proporcionados
     * @param {object} adminData
     * @const {Promise<object>}
     */ 
    const newAdmin = new Admin(adminData);

    return await newAdmin.save();
};

/**
 * @description Obtener un administrador por correo electrónico
 * @param {string} email
 * @returns {Promise<object>}
 */
const getAdminByEmail = async (email) => {
    return await Admin.findOne({ email: new RegExp(`^${email}$`, 'i') });
};

/**
 * @description Obtener todos los administradores
 * @returns {Promise<object>}
 */
const getAllAdmins = async () => {
    return await Admin.find();
};

/**
 * @description Obtener un administrador por ID
 * @param {string} id
 * @returns {Promise<object>}
 */
const getAdminById = async (id) => {
    return await Admin.findById(id);
};

/**
 * @description Actualizar un administrador por su ID
 * @param {string} id
 * @param {object} adminData
 * @returns {Promise<object>}
 */
const updateAdminById = async (id, adminData) => {

    /**
     * @description Actualizar un administrador por su ID, devolviendo el administrador actualizado
     * @param {string} id
     * @param {object} adminData
     * @returns {Promise<object>}
     */
    return await Admin.findByIdAndUpdate(id, adminData, { new: true });
};

/**
 * @description Eliminar un administrador por su ID
 * @param {string} id
 * @returns {Promise<object>}
 */
const deleteAdminById = async (id) => {
    return await Admin.findByIdAndDelete(id);
};

/**
 * @description Eliminar    administradores no verificados por correo electrónico y teléfono
 * @param {string} email
 * @param {string} phone
 * @returns {Promise<object>}
 */
const deleteUnverifiedAdmins = async (email, phone) => {
    return await Admin.deleteMany({ $or: [{ email, isVerified: false }, { phone, isVerified: false }] });
};

/**
 * @description Encontrar un administrador verificado por correo electrónico
 * @param {string} email
 * @returns {Promise<object>}
 */
const findVerifiedAdmin = async (email, phone) => {

    /**
     * @description Encontrar un administrador verificado por correo electrónico
     * @param {string} email
     * @returns {Promise<object>}
     */
    try {

        /**
         * @description Encontrar un administrador verificado por correo electrónico
         * @param {string} email
         * @returns {Promise<object>}
         */
        return await Admin.findOne({ $or: [{ email }, { phone }], isVerified: true });
    } catch (error) {

        /**
         * @description Lanzar un error
         * @param {string} error
         */
        throw new Error("Error buscando admin verificado: " + error.message);
    }
};

/**
 * @description Encontrar un administrador con un código de verificación
 * @param {string} tempId
 * @param {string} code
 * @returns {Promise<object>}
 */
const findAdminWithCode = async (tempId, code) => {
    return await Admin.findOne({ _id: tempId, verificationCode: code, codeExpires: { $gt: Date.now() }});
};

/**
 * @description Actualizar la verificación de un administrador
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<object>}
 */
const updateAdminVerification = async (id, updates) => {
    return await Admin.findByIdAndUpdate(id, { $set: updates }, { new: true });
};

/**
 * @description Encontrar un administrador para restablecer la contraseña
 * @param {string} email
 * @param {string} code
 * @returns {Promise<object>}
 */
const findAdminForReset = async (email, code) => {
    return await Admin.findOne({ email, resetPasswordCode: code, resetPasswordExpires: { $gt: Date.now() } });
};

/**
 * @description Exportar las funciones para su uso en otros módulos
 */ 
module.exports = {
    createAdmin,
    getAdminByEmail,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
    deleteUnverifiedAdmins,
    findVerifiedAdmin,
    findAdminWithCode,
    updateAdminVerification,
    findAdminForReset
};
