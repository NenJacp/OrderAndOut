import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Eliminar un administrador por su ID
 * @param {string} id recibe el ID del administrador
 * @returns {object} retorna el administrador eliminado (lo devuelve antes de eliminar)
 */
const execute = async (id) => {
    
    try {

        /**
         * @description Busca y elimina el administrador por ID
         */
        return await Admin.findByIdAndDelete(id);
    } catch (error) {

        throw new Error ("Administrador no encontrado " + error.message );
    }
};

export default execute;