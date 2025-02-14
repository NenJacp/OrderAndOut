const express = require('express');
const router = express.Router();
const { createRestaurant, getRestaurantByAdmin } = require('./restaurantController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para restaurantes
router.post('/', verifyToken, createRestaurant); // Crear un nuevo restaurante
router.get('/', getRestaurantByAdmin); // Obtener todos los restaurantes
router.get('/:id', getRestaurantByAdmin); // Obtener un restaurante por ID
router.put('/:id', verifyToken, getRestaurantByAdmin); // Actualizar un restaurante
router.delete('/:id', verifyToken, getRestaurantByAdmin); // Eliminar un restaurante

// Ruta para obtener restaurantes por ID de administrador
// router.get('/admin/:adminId', restaurantController.getRestaurantsByAdminId); // Obtener restaurantes por adminId
router.get('/admin/:adminId', verifyToken, getRestaurantByAdmin); // Obtener restaurantes por adminId desde el token

router.get('/mine', verifyToken, getRestaurantByAdmin);

module.exports = router;
