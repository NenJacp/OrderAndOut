import express from 'express'; // Importar express
const router = express.Router(); // Crear un router

import categoryController from './category.controller.js'; // Importar el controlador de categorías
import authMiddleware from '../Auth/auth.middleware.js'; // Importar el middleware de autenticación

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

export default router; 