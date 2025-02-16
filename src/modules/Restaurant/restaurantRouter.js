const express = require('express');
const router = express.Router();
const { createRestaurant, getRestaurantByAdmin, getRestaurantById, getMyRestaurant } = require('./restaurantController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para restaurantes
router.post('/', verifyToken, createRestaurant); // Crear un nuevo restaurante
router.get('/', verifyToken, getRestaurantByAdmin); // Obtener todos los restaurantes

// Ruta para obtener restaurantes por ID de administrador
// router.get('/admin/:adminId', restaurantController.getRestaurantsByAdminId); // Obtener restaurantes por adminId
router.get('/admin/:adminId', verifyToken, getRestaurantByAdmin); // Obtener restaurantes por adminId desde el token

router.get('/mine', verifyToken, getRestaurantByAdmin); // Nueva ruta para obtener el restaurante del usuario actual

module.exports = router;
