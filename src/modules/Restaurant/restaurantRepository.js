////////////////////////////////////////////////////////////
//                     Restaurant Repository                ///
////////////////////////////////////////////////////////////

const Restaurant = require('./restaurantModel'); // Importar el modelo de restaurante

// Función para crear un nuevo restaurante
const createRestaurant = async (restaurantData) => {
    const newRestaurant = new Restaurant(restaurantData);
    return await newRestaurant.save(); // Guardar en la base de datos
};

// Función para obtener todos los restaurantes
const getAllRestaurants = async () => {
    return await Restaurant.find(); // Obtener todos los restaurantes
};

// Función para obtener un restaurante por ID
const getRestaurantById = async (id) => {
    return await Restaurant.findById(id); // Buscar restaurante por ID
};


// Función para actualizar un restaurante
const updateRestaurant = async (id, restaurantData) => {
    return await Restaurant.findByIdAndUpdate(id, restaurantData, { new: true }); // Actualizar restaurante
};

// Función para eliminar un restaurante
const deleteRestaurant = async (id) => {
    return await Restaurant.findByIdAndDelete(id); // Eliminar restaurante
};

// Función para obtener restaurantes por ID de administrador
const getRestaurantsByAdminId = async (adminId) => {
    return await Restaurant.find({ adminId }); // Buscar restaurantes por adminId
};

const getRestaurantByAdminId = async (adminId) => {
    return await Restaurant.findOne({ adminId }).populate('adminId');
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByAdminId,
    getRestaurantByAdminId,
};
