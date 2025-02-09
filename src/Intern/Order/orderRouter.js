////////////////////////////////////////////////////////////
//                     Order Router                       ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const orderController = require('./orderController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para órdenes
router.post('/', verifyToken, orderController.createOrder); // Crear una nueva orden
router.get('/mine', verifyToken, orderController.getOrdersByRestaurantId); // Obtener órdenes por ID de restaurante
router.get('/', orderController.getAllOrders); // Obtener todas las órdenes
router.put('/:id', verifyToken, orderController.updateOrder); // Actualizar una orden
router.delete('/:id', verifyToken, orderController.deleteOrder); // Eliminar una orden

module.exports = router;
