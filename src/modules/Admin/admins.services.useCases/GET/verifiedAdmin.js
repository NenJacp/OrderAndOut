import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Encontrar un administrador verificado por correo electrónico
 * @param {string} email recibe el correo electrónico del administrador
 * @param {string} phone recibe el teléfono del administrador
 * @returns {object} retorna el aadmin verificado
 */
const execute = async (email, phone) => {

    try {

        /**
         * @description Busca y retorna un administrador verificado por correo electrónico
         */
        return await Admin.findOne({ $or: [{ email }, { phone }], isVerified: true });
    } catch (error) {

        /**
         * @description Lanzar un error si no se busca
         */
        throw new Error("Error buscando admin verificado: " + error.message);
    }
};

export default execute;
