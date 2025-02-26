const Kiosk = require('./kiosk.model'); // Importar el modelo de kiosko

/**
* @description Crear un nuevo kiosko
* @param {Object} kioskData recibe los datos del kiosko
* @const {Promise<Object>} createKiosk guarda el kiosko en la base de datos
*/
const createKiosk = async (kioskData) => {

    // Intentar crear un nuevo kiosko
    try {

        /**
         * @description Crear un nuevo kiosko
         */
        const newKiosk = new Kiosk(kioskData);

        /**
         * @description Guardar el nuevo kiosko en la base de datos
         * @returns {Promise<Object>} devuelve el kiosko creado
         */
        return await newKiosk.save(); // Guardar en la base de datos
    } catch (error) {

        // Si ocurre un error, lanzar un error
        throw new Error(`Error al crear el kiosko: ${error.message}`);
    }
};

/**
 * @description Obtener todos los kioskos
 * @const {Promise<Array>} getAllKiosk devuelve todos los kioskos
 */
const getAllKiosk = async () => {
    return await Kiosk.find();
};

/**
* @description Obtener un kiosko por ID
* @param {Object} id - ID del kiosko
* @const {Promise<Object>} getKioskById devuelve el kiosko encontrado
*/
const getKioskById = async (id) => {
    return await Kiosk.findById(id); // Buscar kiosko por ID
};

/**
* @description Obtener todos los kioskos por ID del restaurante
* @param {Object} restaurantId - ID del restaurante
* @const {Promise<Array>} getKiosksByRestaurantId devuelve los kioskos encontrados por ID del restaurante
*/
const getKiosksByRestaurantId = async (restaurantId) => {
    try {
        return await Kiosk.find({ restaurantId: restaurantId }).populate('restaurantId');
    } catch (error) {
        throw new Error(`Error al obtener kioskos: ${error.message}`);
    }
};

/**
* @description Actualizar un kiosko por I   D
* @param {Object} id - ID del kiosko
* @param {Object} kioskData - Datos del kiosko
* @const {Promise<Object>} updateKioskById actualiza el kiosko por ID
*/
const updateKioskById = async (id, kioskData) => {
    return await Kiosk.findByIdAndUpdate(id, kioskData, { new: true }); // Actualizar kiosko por ID
};

/**
* @description Eliminar un kiosko por ID
* @param {Object} id - ID del kiosko
* @const {Promise<Object>} deleteKioskById elimina el kiosko por ID
*/
const deleteKioskById = async (id) => {
    try {
        // Asegurar que el ID sea una cadena válida
        if (typeof id !== 'string' || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('ID de kiosko inválido');
        }
        return await Kiosk.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Error al eliminar el kiosko: ${error.message}`);
    }
};

/**
 * @description Exportar las funciones del servicio
 */
module.exports = {
    createKiosk,
    getAllKiosk,
    getKioskById,
    getKiosksByRestaurantId,
    updateKioskById,
    deleteKioskById,
};
