import Admin from './admin.model.js'; // Importar el modelo de administrador

/**
 * @description Crear un nuevo administrador
 * @param {object} adminData recibe datos del administrador
 * @const {<promise>object} createAdmin los datos del admin en una constante
 */
const createAdmin = async (adminData) => {

    /**
     * @description Crear un nuevo administrador con los datos proporcionados
     * @param {object} adminData recibe datos del administrador
     * @const {Promise<object>} newAdmin crea un nuevo administrador
     */ 
    const newAdmin = new Admin(adminData);

    /**
     * @description Guardar el nuevo administrador
     * @returns {Promise<object>} newAdmin devuelve el nuevo administrador
     */ 
    return await newAdmin.save();
};

/**
 * @description Obtener un administrador por correo electrónico
 * @param {string} email recibe el correo electrónico del administrador
 * @const {Promise<object>} getAdminByEmail obtiene el administrador por correo electrónico
 */
const getAdminByEmail = async (email) => {
    return await Admin.findOne({ email: new RegExp(`^${email}$`, 'i') });
};

/**
 * @description Obtener todos los administradores
 * @const {Promise<object>} getAllAdmins obtiene todos los administradores
 */
const getAllAdmins = async () => {
    return await Admin.find();
};

/**
 * @description Obtener un administrador por ID
 * @param {string} id recibe el ID del administrador
 * @const {Promise<object>} getAdminById obtiene el administrador por ID
 */
const getAdminById = async (id) => {
    return await Admin.findById(id);
};

/**
 * @description Actualizar un administrador por su ID
 * @param {string} id recibe el ID del administrador
 * @param {object} adminData recibe los datos del administrador
 * @const {Promise<object>} updateAdminById actualiza el administrador por ID
 */
const updateAdminById = async (id, adminData) => {

    /**
     * @description Actualizar un administrador por su ID, devolviendo el administrador actualizado
     * @param {string} id recibe el ID del administrador
     * @param {object} adminData recibe los datos del administrador
     * @returns {Promise<object>} devuelve el administrador actualizado
     */
    return await Admin.findByIdAndUpdate(id, adminData, { new: true });
};

/**
 * @description Eliminar un administrador por su ID
 * @param {string} id recibe el ID del administrador
 * @const {Promise<object>} deleteAdminById elimina el administrador por ID
 */
const deleteAdminById = async (id) => {
    return await Admin.findByIdAndDelete(id);
};

/**
 * @description Eliminar    administradores no verificados por correo electrónico y teléfono
 * @param {string} email recibe el correo electrónico del administrador
 * @param {string} phone recibe el teléfono del administrador
 * @const {Promise<object>} deleteUnverifiedAdmins elimina los administradores no verificados por correo electrónico y teléfono
 */
const deleteUnverifiedAdmins = async (email, phone) => {
    return await Admin.deleteMany({ $or: [{ email, isVerified: false }, { phone, isVerified: false }] });
};

/**
 * @description Encontrar un administrador verificado por correo electrónico
 * @param {string} email recibe el correo electrónico del administrador
 * @param {string} phone recibe el teléfono del administrador
 * @const {Promise<object>} findVerifiedAdmin encuentra el administrador verificado por correo electrónico
 */
const findVerifiedAdmin = async (email, phone) => {

    /**
     * @description Encontrar un administrador verificado por correo electrónico
     * @param {string} email recibe el correo electrónico del administrador
     * @returns {Promise<object>} devuelve el administrador verificado por correo electrónico
     */
    try {

        /**
         * @description Encontrar un administrador verificado por correo electrónico
         * @param {string} email
         * @returns {Promise<object>} devuelve el administrador verificado por correo electrónico
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
 * @param {string} tempId recibe el ID del administrador
 * @param {string} code recibe el código de verificación del administrador
 * @const {Promise<object>} findAdminWithCode encuentra el administrador con un código de verificación
 */
const findAdminWithCode = async (tempId, code) => {
    return await Admin.findOne({ _id: tempId, verificationCode: code, codeExpires: { $gt: Date.now() }});
};

/**
 * @description Actualizar la verificación de un administrador
 * @param {string} id recibe el ID del administrador
 * @param {object} updates recibe los datos del administrador
 * @const {Promise<object>} updateAdminVerification actualiza la verificación de un administrador
 */
const updateAdminVerification = async (id, updates) => {
    return await Admin.findByIdAndUpdate(id, updates, { new: true });
};

/**
 * @description Encontrar un administrador para restablecer la contraseña
 * @param {string} email recibe el correo electrónico del administrador
 * @param {string} code recibe el código de restablecimiento de la contraseña del administrador
 * @const {Promise<object>} findAdminForReset encuentra el administrador para restablecer la contraseña
 */
const findAdminForReset = async (email, code) => {
    return await Admin.findOne({ email, resetPasswordCode: code, resetPasswordExpires: { $gt: Date.now() } });
};

/**
 * @description Exportar las funciones para su uso en otros módulos
 */ 
export default {
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
