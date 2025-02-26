const categoryService = require('./category.service');


//ADMIN CONTROLLERS


/**
 * @description Crear una categoría por JWT
 * @param {Object} req
 * @param {Object} res
 */
const createCategory = async (req, res) => {

    /**
    * @description Verificar si el usuario es administrador
    */
    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para crear categorías' });
    }
    
    /**
     * @description Crear una categoría por JWT
     */
    try {

        /**
         * @description Crear una categoría por JWT
         * @const {String} name
         * @const {String} description
         */
        const { name, description } = req.body;

        /**
         * @description Verificar si el usuario tiene un restaurante asignado
         */
        if (!req.user.restaurant || req.user.restaurant === 'Empty') {
            return res.status(400).json({ message: 'Primero debes tener un restaurante asignado' });
        }

        /**
         * @description Crear una categoría por ID
         * @param {Object} categoryData
         *  @param {String} categoryData.name
         *  @param {String} categoryData.description
         *  @param {String} categoryData.restaurantId
         * @const {Object} newCategory
         */
        const newCategory = await categoryService.createCategory({
            name,
            description,
            restaurantId: req.user.restaurant
        });
        
        /**
         * @description Devolver la categoría creada
         * @response {Object} newCategory
         */ 
        res.status(201).json(newCategory);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al crear la categoría' });
    }
};

/**
 * @description Actualizar una categoría por JWT
 * @param {Object} req
 * @param {Object} res
 */
const updateCategoryById_CurrentAdmin = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para actualizar categorías solo los administradores pueden hacerlo' });
    }

    try {
        
        const { categoryId } = req.params.categoryId;
        const { ...updateData } = req.body; // los datos a actualizar

        if (!categoryId) {
            return res.status(400).json({ message: 'Se requiere ID de categoría' });
        }

        const updatedCategory = await categoryService.updateCategoryById(categoryId, updateData);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        if (updatedCategory.restaurantId !== req.user.restaurant) {
            return res.status(403).json({ message: 'No tienes permisos para actualizar esta categoría' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar',
            error: error.message
        });
    }
};

/**
 * @description Eliminar una categoría por JWT
 * @param {Object} req
 * @param {Object} res
 */
const deleteCategoryById_CurrentAdmin = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para eliminar categorías solo los administradores pueden hacerlo' });
    }

    /**
     * @description Eliminar una categoría por JWT
     */
    try {

        /**
         * @description Eliminar una categoría por JWT
         */
        const { categoryId } = req.params.categoryId;

        /**
         * @description Verificar si categoryId existe
         */
        if (!categoryId) {
            return res.status(400).json({ message: 'Se requiere ID de categoría' });
        }

        /**
         * @description Obtener la categoría
         */
        const category = await categoryService.getCategoryById(categoryId);

        /**
         * @description Verificar si la categoría existe
         */
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        /**
         * @description Verificar si la categoría pertenece al restaurante
         */
        if (category.restaurantId.toString() !== req.user.restaurant.toString()) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta categoría' });
        }

        /**
         * @description Eliminar la categoría
         */
        const deletedCategory = await categoryService.deleteCategoryById(categoryId);

        /**
         * @description Devolver la categoría eliminada
         * @response {Object} deletedCategory
         */
        res.status(200).json({ 
            message: 'Categoría eliminada correctamente',
            deletedCategory
        });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
};

/**
 * @description Obtener todas las categorías de un restaurante por JWT
 * @param {Object} req
 * @param {Object} res
 */
const getCategoriesByRestaurant_CurrentUser = async (req, res) => {

    /**
     * @description Obtener todas las categorías de un restaurante por JWT
     */
    try {

        /**
         * @description Obtener todas las categorías de un restaurante por JWT
         * @param {String} req.user.restaurant
         * @const {Object} categories
         */
        const categories = await categoryService.getCategoriesByRestaurantId(req.user.restaurant);

        /**
         * @description Devolver las categorías
         * @response {Object} categories
         */
        res.status(200).json(categories);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

/**
 * @description Obtener una categoría por JWT
 * @param {Object} req
 * @param {Object} res
 */
const getCategoryById_CurrentUser = async (req, res) => {

    /**
     * @description Obtener una categoría por JWT
     */
    try {
        
        /**
         * @description Obtener categoryId del body
         * @const {String} categoryId
         */
        const { categoryId } = req.body.categoryId;

        /**
         * @description Verificar si categoryId existe
         */
        if (!categoryId) {
            return res.status(400).json({ message: 'Se requiere ID de categoría' });
        }

        /**
         * @description Obtener la categoría
         * @const {Object} category
         */
        const category = await categoryService.getCategoryById(categoryId);

        /**
         * @description Verificar si la categoría existe
         */
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        /**
         * @description Verificar si la categoría pertenece al restaurante
         */
        if (category.restaurantId.toString() !== req.user.restaurant.toString()) {
            return res.status(403).json({ message: 'No autorizado para ver esta categoría' });
        }

        /**
         * @description Devolver la categoría
         * @response {Object} category
         */
        res.status(200).json({ category });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al obtener categoría' });
    }
};


//DEVELOPER CONTROLLERS


/**
 * @description Obtener todas las categorías
 * @param {Object} req
 * @param {Object} res
 */
const getAllCategories = async (req, res) => {

    /**
     * @description Obtener todas las categorías
     */
    try {

        /**
         * @description Obtener todas las categorías
         * @const {Object} categories
         */
        const categories = await categoryService.getAllCategories();

        /**
         * @description Devolver las categorías
         * @response {Object} categories
         */
        res.status(200).json(categories);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

/**
 * @description Obtener todas las categorías por ID
 * @param {Object} req
 * @param {Object} res
 */
const getCategoriesByRestaurantId = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para obtener las categorías' });
    }

    /**
     * @description Obtener todas las categorías por ID
     */
    try {

        /**
         * @description Obtener todas las categorías por ID
         * @const {Object} categories
         */
        const categories = await categoryService.getCategoriesByRestaurantId(req.params.restaurantId);

        /**
         * @description Devolver las categorías
         * @response {Object} categories
         */
        res.status(200).json(categories);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

/**
 * @description Obtener una categoría por ID
 * @param {Object} req
 * @param {Object} res
 */
const getCategoryById = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para obtener una categoría' });
    }

    /**
     * @description Obtener una categoría por ID
     */     
    try {

        /**
         * @description Obtener una categoría por ID
         * @param {String} req.params.id
         * @const {Object} category
         */
        const category = await categoryService.getCategoryById(req.params.categoryId);

        /**
         * @description Devolver la categoría
         * @response {Object} category
         */
        res.status(200).json(category);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al obtener la categoría' });
    }
};

/**
 * @description Actualizar una categoría por ID
 * @param {Object} req
 * @param {Object} res
 */
const updateCategoryById = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para actualizar una categoría' });
    }

    /**
     * @description Actualizar una categoría por ID 
     */
    try {

        /**
         * @description Obtener categoryId del body
         * @const {String} categoryId
         */
        const { categoryId } = req.params.categoryId;

        /**
         * @description Obtener los datos a actualizar
         * @const {Object} updateData
         */
        const { ...updateData } = req.body; // los datos a actualizar

        /**
         * @description Verificar si categoryId existe
         */
        if (!categoryId) {
            return res.status(400).json({ message: 'Se requiere ID de categoría' });
        }

        /**
         * @description Actualizar una categoría por ID 
         * @param {String} req.params.id
         * @param {Object} req.body
         * @const {Object} updatedCategory
         */
        const updatedCategory = await categoryService.updateCategoryById(categoryId, updateData);

        /**
         * @description Devolver la categoría actualizada
         * @response {Object} updatedCategory
         */
        res.status(200).json(updatedCategory);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
};

/**
 * @description Eliminar una categoría por ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteCategoryById = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para eliminar una categoría' });
    }

    /**
     * @description Eliminar una categoría por ID
     */
    try {

        /**
         * @description Eliminar una categoría por ID
         * @param {String} req.params.categoryId
         * @const {<Promise>object} deletedCategory
         */
        const deletedCategory = await categoryService.deleteCategoryById(req.params.categoryId);

        /**
         * @description Verificar si la categoría existe
         */
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        /**
         * @description Devolver la categoría eliminada
         * @response {String} message
         */
        res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {String} error.message
         */
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
};

module.exports = { 

    //ADMIN CONTROLLERS 
    createCategory, 
    updateCategoryById_CurrentAdmin, 
    deleteCategoryById_CurrentAdmin, 

    //USER CONTROLLERS

    getCategoriesByRestaurant_CurrentUser, 
    getCategoryById_CurrentUser, 

    //DEVELOPER CONTROLLERS

    getCategoriesByRestaurantId, 
    getAllCategories, 
    getCategoryById, 
    updateCategoryById,
    deleteCategoryById
}; 