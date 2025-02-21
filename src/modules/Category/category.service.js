const Category = require('./category.model'); // Importar el modelo de la categoría

/**
 * @description Crear una categoría por ID
 * @param {Object} categoryData
 * @returns {Promise<Object>}
 */
const createCategoryById = async (categoryData) => {
    return await Category.create(categoryData);
};

/**
 * @description Obtener todas las categorías por ID del restaurante
 * @param {String} restaurantId
 * @returns {Promise<Object>}
 */
const getCategoriesByRestaurantId = async (restaurantId) => {
    return await Category.find({ restaurantId }).sort({ createdAt: -1 });
};

/**
 * @description Obtener todas las categorías
 * @returns {Promise<Object>}
 */
const getAllCategories = async () => {
    return await Category.find().sort({ createdAt: -1 });
};

/**
 * @description Obtener una categoría por ID
 * @param {String} id
 * @param {String} restaurantId
 * @returns {Promise<Object>}
 */
const getCategoryById = async (id, restaurantId) => {
    return await Category.findOne({ _id: id, restaurantId });
};

/**
 * @description Actualizar una categoría por ID
 * @param {String} id
 * @param {Object} categoryData
 * @returns {Promise<Object>}
 */
const updateCategoryById = async (id, categoryData) => {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
};

/**
 * @description Eliminar una categoría por ID
 * @param {String} id
 * @returns {Promise<Object>}
 */
const deleteCategoryById = async (id) => {
    return await Category.findByIdAndDelete(id);
};

module.exports = {
    createCategoryById,
    getAllCategories,
    getCategoriesByRestaurantId,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
}; 