////////////////////////////////////////////////////////////
//                     Order Router                       ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const orderController = require('./orderController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para órdenes
router.post('/:restaurantId', verifyToken, orderController.createOrder); // Crear una nueva orden con ID de restaurante
router.get('/', orderController.getAllOrders); // Obtener todas las órdenes
router.get('/restaurant/:restaurantId', verifyToken, orderController.getOrdersByRestaurantId); // Obtener órdenes por ID de restaurante
router.put('/:id', verifyToken, orderController.updateOrder); // Actualizar una orden
router.delete('/:id', verifyToken, orderController.deleteOrder); // Eliminar una orden

module.exports = router;
