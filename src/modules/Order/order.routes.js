import express from 'express'; // Importar express
const router = express.Router(); // Crear un router

import orderController from './order.controller.js'; // Importar el controlador
import authMiddleware from '../Auth/auth.middleware.js'; // Importar el middleware

//ADMIN ROUTES
router.post('/myOrder', authMiddleware.verifyTokenMiddleware, orderController.createOrder); // Crear una nueva orden

router.get('/mineOrders', authMiddleware.verifyTokenMiddleware, orderController.getOrdersByRestaurant_CurrentUser); // Obtener órdenes por ID de restaurante
router.get('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.getOrderById_CurrentUser); // Obtener una orden por ID
router.put('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.updateOrderById_CurrentAdmin); // Actualizar una orden
router.delete('/myOrder/:orderId', authMiddleware.verifyTokenMiddleware, orderController.deleteOrderById_CurrentAdmin); // Eliminar una orden

//DEVELOPER ROUTES
router.get('/', authMiddleware.verifyTokenMiddleware, orderController.getAllOrders); // Obtener todas las órdenes
router.get('/totalOrders', authMiddleware.verifyTokenMiddleware, orderController.getTotalOrdersByStartDate); // Obtener total de órdenes desde una fecha específica

router.get('/totalCost', authMiddleware.verifyTokenMiddleware, orderController.getTotalCost); // Obtener totalCost de las órdenes del restaurante del usuario actual
router.get('/totalSale', authMiddleware.verifyTokenMiddleware, orderController.getTotalSale); // Obtener totalSale de las órdenes del restaurante del usuario actual
router.get('/totalGains', authMiddleware.verifyTokenMiddleware, orderController.getTotalGains); // Obtener totalGains de las órdenes del restaurante del usuario actual
router.get('/totalGainsByDateRange', authMiddleware.verifyTokenMiddleware, orderController.getTotalGainsByDateRange); // Obtener totalGains en un rango de fechas para el restaurante del usuario actual

export default router;