////////////////////////////////////////////////////////////
//           CONTROLADOR DE CATEGORÍAS                  ///
// Funcionalidades:
// - Creación de categorías por restaurante
// - Gestión de categorías inactivas
// - Validación de unicidad por restaurante
// Seguridad:
// - Requiere autenticación JWT
// - Restringe acceso al restaurante del usuario
////////////////////////////////////////////////////////////

const categoryRepository = require('./categoryRepository');
const Restaurant = require('../Restaurant/restaurantModel');

/**
 * @method createCategory
 * @desc Crea nueva categoría asociada al restaurante del usuario
 * @param {Object} req - Debe contener en el body:
 *   - name: Nombre de la categoría (único por restaurante)
 * @param {Object} res 
 * @returns {Object} - Categoría creada o error de validación
 * @throws {400} - Si el usuario no tiene restaurante asignado
 * @throws {409} - Si la categoría ya existe en el restaurante
 */
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const restaurantId = req.user.restaurant;
        
        if (!restaurantId || restaurantId === 'Empty') {
            return res.status(400).json({ message: 'Primero debes tener un restaurante asignado' });
        }

        const newCategory = await categoryRepository.createCategory({
            name,
            restaurantId
        });
        
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ 
            message: error.code === 11000 
                ? 'Ya existe una categoría con este nombre en tu restaurante' 
                : error.message 
        });
    }
};

const getMyCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.getCategoriesByRestaurant(req.user.restaurant);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nuevo método para desactivar categorías
const deactivateCategory = async (req, res) => {
    try {
        const updatedCategory = await categoryRepository.deactivateCategory(req.params.id);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría desactivada', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createCategory, 
    getMyCategories, 
    deactivateCategory 
}; 