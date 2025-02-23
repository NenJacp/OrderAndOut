const Category = require('./category.model'); // Importar el modelo de la categoría

/**
 * @description Crear una categoría por ID
 * @param {Object} categoryData
 * @returns {Promise<Object>}
 */
const createCategoryByRestaurantId = async (categoryData) => {
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
const getCategoryById = async (id) => {
    
    /**console.log(id);
     * @description Obtener la categoría
     * @const {Object} category
     */
    const category = await Category.findOne({ _id: id});
    /**
     * @description Verificar si la categoría existe
     */
    if (!category) {
        throw new Error('Categoría no encontrada');
    }

    /**
     * @description Devolver la categoría
     * @returns {Object} category
     */
    return category;
};

/**
 * @description Actualizar una categoría por ID
 * @param {String} id
 * @param {Object} categoryData
 * @returns {Promise<Object>}
 */
const updateCategoryById = async (id, categoryData) => {
    try {
        return await Category.findByIdAndUpdate(id, categoryData);
    } catch (error) {
        console.log(error);
    }
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
    createCategoryByRestaurantId,
    getAllCategories,
    getCategoriesByRestaurantId,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
}; 