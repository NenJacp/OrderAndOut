const express = require('express'); // Importar express
const router = express.Router(); // Crear un router

const orderController = require('./order.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

//ADMIN ROUTES
router.post('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.createOrder); // Crear una nueva orden

router.get('/mineOrders', authMiddleware.verifyTokenMiddleware, orderController.getOrdersByRestaurant_CurrentUser); // Obtener órdenes por ID de restaurante
router.get('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.getOrderById_CurrentUser); // Obtener una orden por ID
router.put('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.updateOrderById_CurrentAdmin); // Actualizar una orden
router.delete('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.deleteOrderById_CurrentAdmin); // Eliminar una orden

//DEVELOPER ROUTES
router.get('/', authMiddleware.verifyTokenMiddleware, orderController.getAllOrders); // Obtener todas las órdenes
router.get('/:orderId', authMiddleware.verifyTokenMiddleware, orderController.getOrderById); // Obtener una orden por ID
router.put('/:orderId', authMiddleware.verifyTokenMiddleware, orderController.updateOrderById); // Actualizar una orden
router.delete('/:orderId', authMiddleware.verifyTokenMiddleware, orderController.deleteOrderById); // Eliminar una orden

module.exports = router;