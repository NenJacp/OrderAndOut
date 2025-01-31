////////////////////////////////////////////////////////////
//                     Restaurant Router                   ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const restaurantController = require('./restaurantController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para restaurantes
router.post('/:adminId', verifyToken, restaurantController.createRestaurant); // Crear un nuevo restaurante
router.get('/', restaurantController.getAllRestaurants); // Obtener todos los restaurantes
router.get('/:id', restaurantController.getRestaurantById); // Obtener un restaurante por ID
router.put('/:id', verifyToken, restaurantController.updateRestaurant); // Actualizar un restaurante
router.delete('/:id', verifyToken, restaurantController.deleteRestaurant); // Eliminar un restaurante

// Ruta para obtener restaurantes por ID de administrador
// router.get('/admin/:adminId', restaurantController.getRestaurantsByAdminId); // Obtener restaurantes por adminId
router.get('/admin/:adminId', verifyToken, restaurantController.getRestaurantsByAdminId); // Obtener restaurantes por adminId desde el token

module.exports = router;
