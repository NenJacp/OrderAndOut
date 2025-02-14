////////////////////////////////////////////////////////////
//          REPOSITORIO DE CATEGORÍAS                   ///
// Métodos:                                              ///
//   - Creación con validación de unicidad              ///
//   - Búsqueda por restaurante                        ///
//   - Desactivación lógica                           ///
// Seguridad:                                         ///
//   - Índice único nombre+restaurante               ///
////////////////////////////////////////////////////////

const Category = require('./categoryModel');

/**
 * @method createCategory
 * @desc Crea categoría con validación de nombre único
 * @throws {MongoError} 11000 - Si ya existe en el restaurante
 */
const createCategory = async (categoryData) => {
    return await Category.create(categoryData);
};

const getCategoriesByRestaurant = async (restaurantId) => {
    return await Category.find({ restaurantId }).sort({ createdAt: -1 });
};

const getCategoryById = async (id, restaurantId) => {
    return await Category.findOne({ _id: id, restaurantId });
};

const updateCategory = async (id, categoryData) => {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
};

/**
 * @method deactivateCategory
 * @desc Marca categoría como inactiva (soft delete)
 * @param {String} id - ID de MongoDB
 * @returns {Object} - Categoría actualizada
 */
const deactivateCategory = async (id) => {
    return await Category.findByIdAndUpdate(
        id, 
        { isActive: false }, 
        { new: true }
    );
};

module.exports = {
    createCategory,
    getCategoriesByRestaurant,
    getCategoryById,
    updateCategory,
    deactivateCategory
}; 