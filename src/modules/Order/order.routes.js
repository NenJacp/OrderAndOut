////////////////////////////////////////////////////////////
//                     Order Router                       ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const orderController = require('./order.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Rutas para órdenes
router.post('/', authMiddleware.verifyTokenMiddleware, orderController.createOrder); // Crear una nueva orden
router.get('/', orderController.getAllOrders); // Obtener todas las órdenes
router.get('/mine', authMiddleware.verifyTokenMiddleware, orderController.getOrdersByRestaurantId); // Obtener órdenes por ID de restaurante
router.get('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.getOrderById); // Obtener una orden por ID
router.put('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.updateOrder); // Actualizar una orden
router.delete('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.deleteOrder); // Eliminar una orden

module.exports = router;
