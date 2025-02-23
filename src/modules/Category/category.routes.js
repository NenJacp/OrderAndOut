const express = require('express'); // Importar express
const router = express.Router(); // Crear un router

const categoryController = require('./category.controller'); // Importar el controlador de categorías
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware de autenticación

//////////////////////////////////////////////////////////////////////////////////
//                 █ █ ▄▀▀ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀                    //
//                 ▀▄█ ▄██ █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██                    //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta para crear una categoría por JWT
 */
router.post('/myCategory', authMiddleware.verifyTokenMiddleware, categoryController.createCategoryByJWT);

/**
 * @description Ruta para obtener una categoría por JWT
 */
router.get('/myCategory', authMiddleware.verifyTokenMiddleware, categoryController.getCategoryById_JWT);

/**
 * @description Ruta para obtener todas las categorías de un restaurante por JWT
 */
router.get('/mineCategory', authMiddleware.verifyTokenMiddleware, categoryController.getCategoriesByRestaurantByJWT);

/**
 * @description Ruta para actualizar una categoría por JWT
 */
router.put('/myCategory', authMiddleware.verifyTokenMiddleware, categoryController.updateCategoryById_JWT);

/**
 * @description Ruta para eliminar una categoría por JWT
 */
router.delete('/myCategory', authMiddleware.verifyTokenMiddleware, categoryController.deleteCategoryById_JWT);

//////////////////////////////////////////////////////////////////////////////////
//          █▀▄ ██▀ █ █ ██▀ █   ▄▀▄ █▀▄ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀       //
//          █▄▀ █▄▄ ▀▄▀ █▄▄ █▄▄ ▀▄▀ █▀  █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██       //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta para obtener todas las categorías
 */
router.get('/', authMiddleware.verifyDeveloperToken, categoryController.getAllCategories);

/**
 * @description Ruta para obtener una categoría por ID
 */
router.get('/:categoryId', authMiddleware.verifyDeveloperToken, categoryController.getCategoryById);

/**
 * @description Ruta para obtener todas las categorías de un restaurante por ID
 */
router.get('/restaurant/:categoryId', authMiddleware.verifyDeveloperToken, categoryController.getCategoriesByRestaurantId);

/**
 * @description Ruta para actualizar una categoría por ID
 */
router.put('/:categoryId', authMiddleware.verifyDeveloperToken, categoryController.updateCategoryById);

/**
 * @description Ruta para eliminar una categoría por ID
 */
router.delete('/:categoryId', authMiddleware.verifyDeveloperToken, categoryController.deleteCategoryById);

module.exports = router; 