const express = require('express'); // Importar express
const router = express.Router(); // Crear un router

const restaurantController = require('./restaurant.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware


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

/**
 * @description Ruta para obtener un restaurante por ID
 */
router.get('/:restaurantId', authMiddleware.verifyTokenMiddleware, restaurantController.getRestaurantById); //req.params.restaurantId

/**
 * @description Ruta para actualizar un restaurante por ID
 */
router.put('/:restaurantId', authMiddleware.verifyTokenMiddleware, restaurantController.updateRestaurantById); //req.params.restaurantId, req.body

/**
 * @description Ruta para eliminar un restaurante por ID
 */
router.delete('/:restaurantId', authMiddleware.verifyTokenMiddleware, restaurantController.deleteRestaurantById); //req.params.restaurantId

module.exports = router;
