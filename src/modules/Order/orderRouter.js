////////////////////////////////////////////////////////////
//                     Order Router                       ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const orderController = require('./orderController'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Rutas para órdenes
router.post('/', authMiddleware.verifyTokenMiddleware, orderController.createOrder); // Crear una nueva orden
router.get('/mine', authMiddleware.verifyTokenMiddleware, orderController.getOrdersByRestaurantId); // Obtener órdenes por ID de restaurante
router.get('/', orderController.getAllOrders); // Obtener todas las órdenes
router.put('/:id', authMiddleware.verifyTokenMiddleware, orderController.updateOrder); // Actualizar una orden
router.delete('/:id', authMiddleware.verifyTokenMiddleware, orderController.deleteOrder); // Eliminar una orden

module.exports = router;
