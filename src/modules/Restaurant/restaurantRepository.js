// Importar el modelo de restaurante
const Restaurant = require('./restaurantModel');

// Función para crear un nuevo restaurante
const createRestaurant = async (restaurantData) => {
    const newRestaurant = new Restaurant(restaurantData); // Crear un nuevo objeto de restaurante con los datos proporcionados
    return await newRestaurant.save(); // Guardar el nuevo restaurante en la base de datos y devolver el resultado
};

// Función para obtener todos los restaurantes
const getAllRestaurants = async () => {
    return await Restaurant.find(); // Buscar y devolver todos los restaurantes en la base de datos
};

// Función para obtener un restaurante por ID
const getRestaurantById = async (id) => {
    return await Restaurant.findById(id); // Buscar y devolver un restaurante específico por su ID
};

// Función para actualizar un restaurante
const updateRestaurant = async (id, restaurantData) => {
    return await Restaurant.findByIdAndUpdate(id, restaurantData, { new: true }); // Actualizar un restaurante específico por su ID con los nuevos datos
};

// Función para eliminar un restaurante
const deleteRestaurant = async (id) => {
    return await Restaurant.findByIdAndDelete(id); // Eliminar un restaurante específico por su ID
};

// Función para obtener restaurantes por ID de administrador
const getRestaurantsByAdminId = async (adminId) => {
    return await Restaurant.find({ adminId }); // Buscar y devolver todos los restaurantes asociados a un administrador específico
};

// Función para obtener un restaurante por ID de administrador
const getRestaurantByAdminId = async (adminId) => {
    return await Restaurant.findOne({ adminId })
        .populate('adminId', '-password'); // Buscar y devolver un restaurante específico asociado a un administrador, incluyendo el administrador
};

// Exportar las funciones del repositorio para su uso en otros módulos
module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByAdminId,
    getRestaurantByAdminId,
};
