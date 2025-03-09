import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Encontrar un administrador con un código de verificación
 * @param {string} tempId recibe el ID del administrador
 * @param {string} code recibe el código de verificación del administrador
 * @returns {object} retorna un administrador
 */
const execute = async (tempId, code) => {

    try {

        /**
         * @description retorna un administrador buscado por el codigo y tempId
         */
        return await Admin.findOne({ _id: tempId, verificationCode: code, codeExpires: { $gt: Date.now() }});
    } catch (error) {

        throw new Error ("no se busco el admin " + error.message);
    }
    
};

export default execute;
