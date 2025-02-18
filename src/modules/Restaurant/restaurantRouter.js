const express = require('express');
const router = express.Router();
const restaurantController = require('./restaurantController'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Rutas para restaurantes
router.post('/', authMiddleware.verifyToken, restaurantController.createRestaurant); // Crear un nuevo restaurante
router.get('/', authMiddleware.verifyToken, restaurantController.getRestaurantByAdmin); // Obtener todos los restaurantes

// Ruta para obtener restaurantes por ID de administrador
// router.get('/admin/:adminId', restaurantController.getRestaurantsByAdminId); // Obtener restaurantes por adminId
router.get('/admin/:adminId', authMiddleware.verifyToken, restaurantController.getRestaurantByAdmin); // Obtener restaurantes por adminId desde el token

router.get('/mine', authMiddleware.verifyToken, restaurantController.getRestaurantByAdmin); // Nueva ruta para obtener el restaurante del usuario actual

module.exports = router;
