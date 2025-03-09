import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Servicio para actualizar un administrador por su ID
 * @param {string} id recibe el ID del administrador
 * @param {object} adminData recibe los datos del administrador
 * @returns {object} retorna el admin modificado/actualizado
 */
const execute = async (id, adminData) => {
    try {

        /**
        * @description Actualizar un administrador por su ID, retorna el administrador actualizado
        */
        return await Admin.findByIdAndUpdate(id, adminData, { new: true });
    } catch (error) {

        throw new Error ("No se busco el administrador " + error.message );
    }
};

export default execute;