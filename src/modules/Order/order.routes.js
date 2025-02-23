////////////////////////////////////////////////////////////
//                     Order Router                       ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const orderController = require('./order.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Rutas para órdenes
router.post('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.createOrder); // Crear una nueva orden
router.get('/', orderController.getAllOrders); // Obtener todas las órdenes
router.get('/mineOrders', authMiddleware.verifyTokenMiddleware, orderController.getOrdersByRestaurantId); // Obtener órdenes por ID de restaurante
router.get('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.getOrderById_JWT); // Obtener una orden por ID
router.put('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.updateOrderById_JWT); // Actualizar una orden
router.delete('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.deleteOrderById_JWT); // Eliminar una orden

module.exports = router;
