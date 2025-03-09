import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Eliminar administradores no verificados por correo electrónico y teléfono
 * @param {string} email recibe el correo electrónico del administrador
 * @param {string} phone recibe el teléfono del administrador
 * @returns devuelve los admins eliminados
 */
const execute = async (email, phone) => {

    try {

        /**
         * @description Busca y borra administradores que no esten verificados
         */
        return await Admin.deleteMany({ $or: [{ email, isVerified: false }, { phone, isVerified: false }] });
    } catch (error) {

        throw new Error("Administradores no buscados " + error.message );
    }

};

export default execute;