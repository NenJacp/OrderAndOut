const Restaurant = require('./restaurant.model'); // Importar el modelo de restaurante

/**
 * @description Función para crear un nuevo restaurante
 * @param {object} restaurantData
 * @returns {Promise<object>}
 */
const createRestaurantById = async (restaurantData) => {
    const newRestaurant = new Restaurant(restaurantData); // Crear un nuevo objeto de restaurante con los datos proporcionados
    return await newRestaurant.save(); // Guardar el nuevo restaurante en la base de datos y devolver el resultado
};

/**
 * @description Función para obtener todos los restaurantes
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<object>}
 */
const getAllRestaurants = async (page, limit) => {
    const skip = (page - 1) * limit; // Calcular el número de restaurantes a saltar
    return await Restaurant.find()
        .skip(skip) // Saltar los restaurantes necesarios
        .limit(limit); // Limitar el número de restaurantes devueltos
};

/**
 * @description Función para obtener un restaurante por ID
 * @param {string} id
 * @returns {Promise<object>}
 */
const getRestaurantById = async (id) => {
    return await Restaurant.findById(id); // Buscar y devolver un restaurante específico por su ID
};

/**
 * @description Función para actualizar un restaurante
 * @param {string} id
 * @param {object} restaurantData
 * @returns {Promise<object>}
 */
const updateRestaurantById = async (id, restaurantData) => {
    return await Restaurant.findByIdAndUpdate(id, restaurantData, { new: true }); // Actualizar un restaurante específico por su ID con los nuevos datos
};

/**
 * @description Función para eliminar un restaurante
 * @param {string} id
 * @returns {Promise<object>}
 */
const deleteRestaurantById = async (id) => {
    return await Restaurant.findByIdAndDelete(id); // Eliminar un restaurante específico por su ID
};

/**
 * @description Exportar las funciones del repositorio para su uso en otros módulos
 * @returns {object}
 */
module.exports = {
    createRestaurantById,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurantById,
    deleteRestaurantById,
};
