import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Encontrar un administrador para restablecer la contraseña
 * @param {string} email recibe el correo electrónico del administrador
 * @param {string} code recibe el código de restablecimiento de la contraseña del administrador
 * @returns {object} retorn el administrador
 */
const execute = async (email, code) => {
    try {

        /**
         * @description Busca y retornaa un admin
         */
        return await Admin.findOne({ email, resetPasswordCode: code, resetPasswordExpires: { $gt: Date.now() } });
    } catch (error) {

        throw new Error ("Administrador no encontrador " + error.message);
    }
};

export default execute;