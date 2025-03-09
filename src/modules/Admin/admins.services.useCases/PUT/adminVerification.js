import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Actualizar la verificación de un administrador
 * @param {string} id recibe el ID del administrador
 * @param {object} updates recibe los datos del administrador
 * @returns {object} retorna el admin actualizado
 */
const execute = async (id, updates) => {
    
    try {

        /**
         * @description busca y actualiza el administrador
         */
        return await Admin.findByIdAndUpdate(id, { $set: updates }, { new: true });
    } catch (error) {

        throw new Error ("No se busco el administrador" + error.message);
    }
};