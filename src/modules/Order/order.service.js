import executeCreateOrder from './orders.services/POST/createOrder.js'; // Cambiado a importación por defecto
import executeGetAllOrders from './orders.services/GET/allOrders.js'; // Importar caso de uso para obtener todas las órdenes
import executeGetOrderById from './orders.services/GET/orderById.js'; // Importar caso de uso para obtener orden por ID
import executeGetOrdersByRestaurantId from './orders.services/GET/ordersByRestaurantId.js'; // Importar caso de uso para obtener órdenes por ID de restaurante
import executeUpdateOrderById from './orders.services/PUT/orderById.js'; // Importar caso de uso para actualizar orden
import executeDeleteOrderById from './orders.services/DELETE/orderById.js'; // Importar caso de uso para eliminar orden
import { 
    executeTotalOrdersByDateRangeAndRestaurantId, 
    executeTotalCostByDateRangeAndRestaurantId, 
    executeTotalSaleByDateRangeAndRestaurantId, 
    executeTotalGainsByDateRangeAndRestaurantId,
    executeTop5ProductsByDateRangeAndRestaurantId,
    executeOrdersByPaymentMethodByDateRangeAndRestaurantId
} from './orders.services/GET/dashboardData.js'; // Importar casos de uso para dashboard

// Función para crear una nueva orden
const createOrder = async (orderData) => {
    return await executeCreateOrder(orderData); // Usar el caso de uso para crear la orden
};

// Función para obtener todas las órdenes
const getAllOrders = async () => {
    return await executeGetAllOrders(); // Usar el caso de uso para obtener todas las órdenes
};

// Función para obtener una orden específica por ID
const getOrderById = async (id) => {
    return await executeGetOrderById(id); // Usar el caso de uso para obtener la orden por ID
};

// Función para obtener todas las órdenes de un restaurante específico
const getOrdersByRestaurantId = async (restaurantId) => {
    return await executeGetOrdersByRestaurantId(restaurantId); // Usar el caso de uso para obtener órdenes por ID de restaurante
};

// Función para actualizar una orden
const updateOrderById = async (id, orderData) => {
    return await executeUpdateOrderById(id, orderData); // Usar el caso de uso para actualizar la orden
};

// Función para eliminar una orden por ID
const deleteOrderById = async (id) => {
    return await executeDeleteOrderById(id); // Usar el caso de uso para eliminar la orden
};

// Nueva función para obtener el total de órdenes en un rango de fechas para un restaurante específico
const getTotalOrdersByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeTotalOrdersByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Usar el caso de uso para obtener el total de órdenes
};

// Nueva función para obtener el totalCost en un rango de fechas para un restaurante específico
const getTotalCostByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeTotalCostByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Usar el caso de uso para obtener el totalCost
};

// Nueva función para obtener el totalSale en un rango de fechas para un restaurante específico
const getTotalSaleByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeTotalSaleByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Usar el caso de uso para obtener el totalSale
};

// Nueva función para obtener el totalGains en un rango de fechas para un restaurante específico
const getTotalGainsByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeTotalGainsByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Usar el caso de uso para obtener el totalGains
};

// Nueva función para obtener el total de órdenes en un rango de fechas para un restaurante específico
const getTotalOrdersByStartDateAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeTotalOrdersByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Llama al servicio correspondiente
};

const getTop5ProductsByDateRangeAndRestaurantId = async(startDate, endDate, restaurantId) => {
    return await executeTop5ProductsByDateRangeAndRestaurantId(startDate, endDate, restaurantId);
}

const getOrdersByPaymentMethodByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeOrdersByPaymentMethodByDateRangeAndRestaurantId(startDate, endDate, restaurantId);
};

export default
{
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByRestaurantId,
    updateOrderById,
    deleteOrderById,
    getTotalOrdersByDateRangeAndRestaurantId,
    getTotalCostByDateRangeAndRestaurantId,
    getTotalSaleByDateRangeAndRestaurantId,
    getTotalGainsByDateRangeAndRestaurantId,
    getTotalOrdersByStartDateAndRestaurantId,
    getTop5ProductsByDateRangeAndRestaurantId,
    getOrdersByPaymentMethodByDateRangeAndRestaurantId
}