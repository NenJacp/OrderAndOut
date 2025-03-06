import express from 'express'; // Importar express
const router = express.Router(); // Crear un router

import orderController from './order.controller.js'; // Importar el controlador
import authMiddleware from '../Auth/auth.middleware.js'; // Importar el middleware

// ADMIN ROUTES
router.delete('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.deleteOrderByIdHandler); // Eliminar una orden
router.get('/mineOrders', authMiddleware.verifyTokenMiddleware, orderController.getOrdersByRestaurantHandler); // Obtener órdenes por ID de restaurante
router.get('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.getOrderByIdHandler); // Obtener una orden por ID
router.post('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.createOrderHandler); // Crear una nueva orden
router.put('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.updateOrderByIdHandler); // Actualizar una orden

// DEVELOPER ROUTES
router.get('/', authMiddleware.verifyTokenMiddleware, orderController.getAllOrdersHandler); // Obtener todas las órdenes
router.get('/myDashboard', authMiddleware.verifyTokenMiddleware, orderController.getMyDashboardHandler); // Obtener totalGains en un rango de fechas para el restaurante del usuario actual

export default router;