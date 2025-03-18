import Admin from '../../admin.model'; // Importar el modelo de administrador

/**
 * @description Servicio para crear un administrador
 * @param {object} adminData recibe datos para crear un administrador
 * @returns {object} retorna la informacion del admin
 */
const execute = async (adminData) => {
    /**
     * @description Crear un nuevo administrador con los datos proporcionados
     */ 
    const newAdmin = new Admin(adminData);

    /**
     * @description Guardar el nuevo administrador y lo retorna
     */ 
    return await newAdmin.save();
};

export default execute