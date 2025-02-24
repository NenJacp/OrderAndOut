const Kiosk = require('./kiosk.model'); // Importar el modelo de kiosko

/**
* @description Crear un nuevo kiosko
* @param {Object} kioskData - Datos del kiosko
* @returns {Promise<Object>} - Kiosko creado
*/
const createKioskById = async (kioskData) => {
    console.log("kioskData", kioskData);
    try {
        const newKiosk = new Kiosk(kioskData);
        console.log("newKiosk", newKiosk);
        return await newKiosk.save(); // Guardar en la base de datos
    } catch (error) {
        throw new Error(`Error al crear el kiosko: ${error.message}`);
    }
};

/**
* @description Obtener todos los kioskos
* @returns {Promise<Array>} - Array de kioskos
*/
const getAllKiosk = async () => {
    return await Kiosk.find();
}

/**
* @description Obtener un kiosko por ID
* @param {Object} id - ID del kiosko
* @returns {Promise<Object>} - Kiosko encontrado
*/
const getKioskById = async (id) => {
    return await Kiosk.findById(id); // Buscar kiosko por ID
};

/**
* @description Obtener todos los kioskos por ID del restaurante
* @param {Object} restaurantId - ID del restaurante
* @returns {Promise<Array>} - Array de kioskos
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
* @returns {Promise<Object>} - Kiosko actualizado
*/
const updateKioskById = async (id, kioskData) => {
    return await Kiosk.findByIdAndUpdate(id, kioskData, { new: true }); // Actualizar kiosko por ID
};

/**
* @description Eliminar un kiosko por ID
* @param {Object} id - ID del kiosko
* @returns {Promise<Object>} - Kiosko eliminado
*/
const deleteKioskById = async (id) => {
    return await Kiosk.findByIdAndDelete(id); // Eliminar kiosko por ID
};

/**
* @description Contar kioskos conectados por restaurante
* @param {Object} query - Objeto de consulta
* @returns {Promise<number>} - Cantidad de documentos
*/
const countDocuments = async (query) => {
    return await Kiosk.countDocuments(query); // Usar el método nativo de Mongoose
};

/**
 * @description Exportar las funciones del servicio
 */
module.exports = {
    createKioskById,
    getAllKiosk,
    getKioskById,
    getKiosksByRestaurantId,
    countDocuments,
    updateKioskById,
    deleteKioskById,
};
