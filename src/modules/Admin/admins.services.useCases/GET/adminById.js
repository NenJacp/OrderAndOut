import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Servicio para obtener un administrador por ID
 * @param {string} id recibe el ID del administrador
 * @returns {object} retorna el admin encontradro
 */
const execute = async (id) => {
    try {

        /**
        * @description Busca y retorna el admin buscado
        */
        return await Admin.findById(id);
    } catch (error) {

        throw new Error ("no se busco el administrador " + error.message);
    }
};

export default execute;