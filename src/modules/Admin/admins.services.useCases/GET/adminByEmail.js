import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Servicio para obtener un administrador por correo electrónico
 * @param {string} email recibe el correo electrónico del administrador
 * @returns {object} getAdminByEmail obtiene el administrador por correo electrónico
 */
const execute = async (email) => {

    try {
        /**
         * @description Busca y devuelve el admin que tenga el email pasado
         */
        return await Admin.findOne({ email: new RegExp(`^${email}$`, 'i') });
    } catch (error) {

        throw new Error("No se encontro el administrador " + error.message);
    }
};

export default execute;