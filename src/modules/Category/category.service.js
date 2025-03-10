import Category from './category.model.js'; // Importar el modelo de la categoría

/**
 * @description Crear una categoría por ID
 * @param {Object} categoryData
 * @returns {Promise<Object>}
 */
const createCategory = async (categoryData) => {
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
    try {
        const category = await Category.findById(id);        
        return category;
    } catch (error) {
        throw new Error(`Error al obtener la categoría: ${error.message}`);
    }
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

export default {
    createCategory,
    getAllCategories,
    getCategoriesByRestaurantId,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
}; 