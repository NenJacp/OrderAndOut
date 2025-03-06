import createOrder from './orders.controllers/POST/createOrden.js'; // Importar controlador para crear orden
import getOrderById_CurrentUser from './orders.controllers/GET/orderById_CurrentUser.js'; // Importar controlador para obtener orden por ID
import getOrdersByRestaurant_CurrentUser from './orders.controllers/GET/ordersByRestaurant_CurrentUser.js'; // Importar controlador para obtener órdenes por ID de restaurante
import updateOrderById_CurrentAdmin from './orders.controllers/PUT/orderById_CurrentAdmin.js'; // Importar controlador para actualizar orden
import deleteOrderById_CurrentAdmin from './orders.controllers/DELETE/orderById_CurrentAdmin.js'; // Importar controlador para eliminar orden
import getAllOrders from './orders.controllers/GET/allOrders.js'; // Importar controlador para obtener todas las órdenes
import getMyDashboard from './orders.controllers/GET/myDashboard.js'; // Importar controlador para obtener el dashboard

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

export default 
{
    createOrderHandler,
    getOrderByIdHandler,
    getOrdersByRestaurantHandler,
    updateOrderByIdHandler,
    deleteOrderByIdHandler,
    getAllOrdersHandler,
    getMyDashboardHandler
}