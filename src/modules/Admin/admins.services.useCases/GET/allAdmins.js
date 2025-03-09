import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Servicio para obtener todos los administradores
 * @returns {object} retorna los administradores
 */
const execute = async () => {

    /**
     * @description Busca y retorna todos los administradores
     */
    return await Admin.find();
};

export default execute;