const express = require('express'); // Importar express
const router = express.Router(); // Crear un router

const categoryController = require('./category.controller'); // Importar el controlador de categorías
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware de autenticación

// ADMIN ROUTES

/**
 * @description Ruta para crear una categoría por JWT
 */
router.post('/myCategory', authMiddleware.verifyTokenMiddleware, categoryController.createCategory);

/**
 * @description Ruta para obtener una categoría por JWT
 */
router.get('/myCategory/:categoryId', authMiddleware.verifyTokenMiddleware, categoryController.getCategoryById_CurrentUser);

/**
 * @description Ruta para obtener todas las categorías de un restaurante por JWT
 */
router.get('/mineCategory', authMiddleware.verifyTokenMiddleware, categoryController.getCategoriesByRestaurant_CurrentUser);

/**
 * @description Ruta para actualizar una categoría por JWT
 */
router.put('/myCategory/:categoryId', authMiddleware.verifyTokenMiddleware, categoryController.updateCategoryById_CurrentAdmin);

/**
 * @description Ruta para eliminar una categoría por JWT
 */
router.delete('/myCategory/:categoryId', authMiddleware.verifyTokenMiddleware, categoryController.deleteCategoryById_CurrentAdmin);


// DEVELOPER ROUTES


/**
 * @description Ruta para obtener todas las categorías
 */
router.get('/', authMiddleware.verifyTokenMiddleware, categoryController.getAllCategories);

/**
 * @description Ruta para obtener una categoría por ID
 */
router.get('/:categoryId', authMiddleware.verifyTokenMiddleware, categoryController.getCategoryById);

/**
 * @description Ruta para obtener todas las categorías de un restaurante por ID
 */
router.get('/:restaurantId', authMiddleware.verifyTokenMiddleware, categoryController.getCategoriesByRestaurantId);

/**
 * @description Ruta para actualizar una categoría por ID
 */
router.put('/:categoryId', authMiddleware.verifyTokenMiddleware, categoryController.updateCategoryById);

/**
 * @description Ruta para eliminar una categoría por ID
 */
router.delete('/:categoryId', authMiddleware.verifyTokenMiddleware, categoryController.deleteCategoryById);

module.exports = router; 