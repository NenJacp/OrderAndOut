import createOrder from './orders.controllers.useCases/POST/createOrden.js'; // Importar caso de uso para crear orden
import getOrderById_CurrentUser from './orders.controllers.useCases/GET/orderById_CurrentUser.js'; // Importar caso de uso para obtener orden por ID
import getOrdersByRestaurant_CurrentUser from './orders.controllers.useCases/GET/ordersByRestaurant_CurrentUser.js'; // Importar caso de uso para obtener órdenes por ID de restaurante
import updateOrderById_CurrentAdmin from './orders.controllers.useCases/PUT/orderById_CurrentAdmin.js'; // Importar caso de uso para actualizar orden
import deleteOrderById_CurrentAdmin from './orders.controllers.useCases/DELETE/orderById_CurrentAdmin.js'; // Importar caso de uso para eliminar orden
import getAllOrders from './orders.controllers.useCases/GET/allOrders.js'; // Importar caso de uso para obtener todas las órdenes

// Importar controladores de dashboard
import getMyDashboardPaymentMethod from './orders.controllers.useCases/GET/myDashboardPaymentMethod.js'; // Importar controlador para estadísticas de pago
import getMyDashboardTopProducts from './orders.controllers.useCases/GET/myDashboardTopProducts.js'; // Importar controlador para productos más vendidos
import getMyDashboardTotalCost from './orders.controllers.useCases/GET/myDashboardTotalCost.js'; // Importar controlador para total de costos
import getMyDashboardTotalGains from './orders.controllers.useCases/GET/myDashboardTotalGains.js'; // Importar controlador para total de ganancias
import getMyDashboardTotalOrders from './orders.controllers.useCases/GET/myDashboardTotalOrders.js'; // Importar controlador para total de órdenes
import getMyDashboardTotalSale from './orders.controllers.useCases/GET/myDashboardTotalSale.js'; // Importar controlador para total de ventas

/**
 * @description Función para crear una nueva orden
 * @param {Object} req 
 * @param {Object} res 
 */
const createOrderHandler = async (req, res) => {
    return await createOrder(req, res); // Usar el controlador para crear la orden
}

/**
 * @description Función para obtener una orden específica por ID
 * @param {Object} req 
 * @param {Object} res 
 */
const getOrderByIdHandler = async (req, res) => {
    return await getOrderById_CurrentUser(req, res); // Usar el controlador para obtener la orden por ID
}

/**
 * @description Función para obtener órdenes por ID de restaurante
 * @param {Object} req 
 * @param {Object} res 
 */
const getOrdersByRestaurantHandler = async (req, res) => {
    return await getOrdersByRestaurant_CurrentUser(req, res); // Usar el controlador para obtener órdenes por ID de restaurante
}

/**
 * @description Función para actualizar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
const updateOrderByIdHandler = async (req, res) => {
    return await updateOrderById_CurrentAdmin(req, res); // Usar el controlador para actualizar la orden
}

/**
 * @description Función para eliminar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
const deleteOrderByIdHandler = async (req, res) => {
    return await deleteOrderById_CurrentAdmin(req, res); // Usar el controlador para eliminar la orden
}

/**
 * @description Función para obtener todas las órdenes
 * @param {Object} req 
 * @param {Object} res 
 */
const getAllOrdersHandler = async (req, res) => {
    return await getAllOrders(req, res); // Usar el controlador para obtener todas las órdenes
}

/**
 * @description Función para obtener el dashboard del usuario actual con totales de órdenes y ganancias en un rango de fechas
 * @param {Object} req 
 * @param {Object} res 
 */
const getMyDashboardHandler = async (req, res) => {
    return await getMyDashboard(req, res); // Usar el controlador para obtener el dashboard
}

/**
 * @description Función para obtener estadísticas de pago en el dashboard
 * @param {Object} req 
 * @param {Object} res 
 */
const getMyDashboardPaymentMethodHandler = async (req, res) => {
    return await getMyDashboardPaymentMethod(req, res); // Usar el controlador para obtener estadísticas de pago
}

/**
 * @description Función para obtener los 5 productos más vendidos en el dashboard
 * @param {Object} req 
 * @param {Object} res 
 */
const getMyDashboardTopProductsHandler = async (req, res) => {
    return await getMyDashboardTopProducts(req, res); // Usar el controlador para obtener los productos más vendidos
}

/**
 * @description Función para obtener el total de costos en el dashboard
 * @param {Object} req 
 * @param {Object} res 
 */
const getMyDashboardTotalCostHandler = async (req, res) => {
    return await getMyDashboardTotalCost(req, res); // Usar el controlador para obtener el total de costos
}

/**
 * @description Función para obtener el total de ganancias en el dashboard
 * @param {Object} req 
 * @param {Object} res 
 */
const getMyDashboardTotalGainsHandler = async (req, res) => {
    return await getMyDashboardTotalGains(req, res); // Usar el controlador para obtener el total de ganancias
}

/**
 * @description Función para obtener el total de órdenes en el dashboard
 * @param {Object} req 
 * @param {Object} res 
 */
const getMyDashboardTotalOrdersHandler = async (req, res) => {
    return await getMyDashboardTotalOrders(req, res); // Usar el controlador para obtener el total de órdenes
}

/**
 * @description Función para obtener el total de ventas en el dashboard
 * @param {Object} req 
 * @param {Object} res 
 */
const getMyDashboardTotalSaleHandler = async (req, res) => {
    return await getMyDashboardTotalSale(req, res); // Usar el controlador para obtener el total de ventas
}

export default {
    createOrderHandler,
    getOrderByIdHandler,
    getOrdersByRestaurantHandler,
    updateOrderByIdHandler,
    deleteOrderByIdHandler,
    getAllOrdersHandler,
    getMyDashboardHandler,
    getMyDashboardPaymentMethodHandler,
    getMyDashboardTopProductsHandler,
    getMyDashboardTotalCostHandler,
    getMyDashboardTotalGainsHandler,
    getMyDashboardTotalOrdersHandler,
    getMyDashboardTotalSaleHandler
};