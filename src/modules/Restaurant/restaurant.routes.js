import express from 'express'; // Importar express
const router = express.Router(); // Crear un router

import restaurantController from './restaurant.controller.js'; // Importar el controlador
import authMiddleware from '../Auth/auth.middleware.js'; // Importar el middleware


//ADMIN ROUTES


/**
 * @description Ruta para crear un nuevo restaurante por JWT
 */
router.post('/myRestaurant', authMiddleware.verifyTokenMiddleware, restaurantController.createRestaurant_CurrentAdmin); //req.body, req.user

/**
 * @description Ruta para obtener el restaurante del usuario actual por JWT
 */
router.get('/myRestaurant', authMiddleware.verifyTokenMiddleware, restaurantController.getRestaurant_CurrentAdmin); //req.user

/**
 * @description Ruta para actualizar un restaurante por JWT
 */
router.put('/myRestaurant', authMiddleware.verifyTokenMiddleware, restaurantController.updateRestaurant_CurrentAdmin); //req.body, req.user

/**
 * @description Ruta para eliminar un restaurante por JWT
 */
router.delete('/myRestaurant', authMiddleware.verifyTokenMiddleware, restaurantController.deleteRestaurant_CurrentAdmin); //req.body, req.user


//DEVELOPER ROUTES


/**
 * @description Ruta para obtener todos los restaurantes
 */
router.get('/', authMiddleware.verifyTokenMiddleware, restaurantController.getAllRestaurants); //req.body.query.page, req.body.query.limit

export default router;
