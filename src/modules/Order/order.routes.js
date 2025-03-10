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

// Rutas para el dashboard
router.get('/myDashboard/paymentMethod', authMiddleware.verifyTokenMiddleware, orderController.getMyDashboardPaymentMethodHandler); // Obtener estadísticas de pago
router.get('/myDashboard/topProducts', authMiddleware.verifyTokenMiddleware, orderController.getMyDashboardTopProductsHandler); // Obtener los 5 productos más vendidos
router.get('/myDashboard/totalCost', authMiddleware.verifyTokenMiddleware, orderController.getMyDashboardTotalCostHandler); // Obtener total de costos
router.get('/myDashboard/totalGains', authMiddleware.verifyTokenMiddleware, orderController.getMyDashboardTotalGainsHandler); // Obtener total de ganancias
router.get('/myDashboard/totalOrders', authMiddleware.verifyTokenMiddleware, orderController.getMyDashboardTotalOrdersHandler); // Obtener total de órdenes
router.get('/myDashboard/totalSale', authMiddleware.verifyTokenMiddleware, orderController.getMyDashboardTotalSaleHandler); // Obtener total de ventas

export default router;