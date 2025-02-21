const express = require('express');
const router = express.Router();

const restaurantController = require('./restaurant.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

//////////////////////////////////////////////////////////////////////////////////
//                 █ █ ▄▀▀ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀                    //
//                 ▀▄█ ▄██ █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██                    //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta para crear un nuevo restaurante por JWT
 */
router.post('/', authMiddleware.verifyTokenMiddleware, restaurantController.createRestaurantByJWT); // Crear un nuevo restaurante por JWT

/**
 * @description Ruta para obtener el restaurante del usuario actual por JWT
 */
router.get('/mine', authMiddleware.verifyTokenMiddleware, restaurantController.getRestaurantByJWT); // Obtener el restaurante del usuario actual por JWT

/**
 * @description Ruta para actualizar un restaurante por JWT
 */
router.put('/mine', authMiddleware.verifyTokenMiddleware, restaurantController.updateRestaurantByJWT); // Actualizar un restaurante por JWT

/**
 * @description Ruta para eliminar un restaurante por JWT
 */
router.delete('/mine', authMiddleware.verifyTokenMiddleware, restaurantController.deleteRestaurantByJWT); // Eliminar un restaurante por JWT

//////////////////////////////////////////////////////////////////////////////////
//          █▀▄ ██▀ █ █ ██▀ █   ▄▀▄ █▀▄ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀       //
//          █▄▀ █▄▄ ▀▄▀ █▄▄ █▄▄ ▀▄▀ █▀  █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██       //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta para obtener todos los restaurantes
 */
router.get('/', authMiddleware.verifyDeveloperToken, restaurantController.getAllRestaurants); // Obtener todos los restaurantes

/**
 * @description Ruta para obtener un restaurante por ID
 */
router.get('/:id', authMiddleware.verifyDeveloperToken, restaurantController.getRestaurantById); // Obtener un restaurante por ID

/**
 * @description Ruta para actualizar un restaurante por ID
 */
router.put('/:id', authMiddleware.verifyDeveloperToken, restaurantController.updateRestaurantById); // Actualizar un restaurante por ID

/**
 * @description Ruta para eliminar un restaurante por ID
 */
router.delete('/:id', authMiddleware.verifyDeveloperToken, restaurantController.deleteRestaurantById); // Eliminar un restaurante por ID

module.exports = router;
