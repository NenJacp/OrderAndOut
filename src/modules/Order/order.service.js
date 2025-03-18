import executeCreateOrder from './orders.services.useCases/POST/createOrder.js'; // Cambiado a importación por defecto
import executeGetAllOrders from './orders.services.useCases/GET/allOrders.js'; // Importar caso de uso para obtener todas las órdenes
import executeGetOrderById from './orders.services.useCases/GET/orderById.js'; // Importar caso de uso para obtener orden por ID
import executeGetOrdersByRestaurantId from './orders.services.useCases/GET/ordersByRestaurantId.js'; // Importar caso de uso para obtener órdenes por ID de restaurante
import executeUpdateOrderById from './orders.services.useCases/PUT/orderById.js'; // Importar caso de uso para actualizar orden
import executeDeleteOrderById from './orders.services.useCases/DELETE/orderById.js'; // Importar caso de uso para eliminar orden
import executeCalculateTotalSale from './orders.services.useCases/GET/calculateTotalSale.js'; // Importar caso de uso para calcular total

// Importar servicios de dashboard
import executeTotalOrdersByDateRangeAndRestaurantId from './orders.services.useCases/GET/dashboardTotalOrders.js'; // Total de órdenes
import executeTotalCostByDateRangeAndRestaurantId from './orders.services.useCases/GET/dashboardTotalCost.js'; // Total de costos
import executeTotalSaleByDateRangeAndRestaurantId from './orders.services.useCases/GET/dashboardTotalSale.js'; // Total de ventas
import executeTotalGainsByDateRangeAndRestaurantId from './orders.services.useCases/GET/dashboardTotalGains.js'; // Total de ganancias
import executeTop5ProductsByDateRangeAndRestaurantId from './orders.services.useCases/GET/dashboardTopProducts.js'; // Top 5 productos
import executeOrdersByPaymentMethodByDateRangeAndRestaurantId from './orders.services.useCases/GET/dashboardPaymentMethod.js'; // Estadísticas de pago
import executeTopCategoriesByDateRangeAndRestaurantId from './orders.services.useCases/GET/dashboardTopCategories.js'; // Asegúrate de que el nombre sea correcto

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

// Nueva función para obtener los 5 productos más vendidos en un rango de fechas para un restaurante específico
const getTop5ProductsByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeTop5ProductsByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Usar el caso de uso para obtener los 5 productos más vendidos
};

// Nueva función para obtener estadísticas de pago por método en un rango de fechas
const getOrdersByPaymentMethodByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeOrdersByPaymentMethodByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Usar el caso de uso para obtener estadísticas de pago
};

// Nueva función para obtener las categorías más consumidas en un rango de fechas para un restaurante específico
const getTopCategoriesByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    return await executeTopCategoriesByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Usar el caso de uso para obtener las categorías más consumidas
};

// Función para calcular el total de venta
const calculateTotalSale = async (productsData) => {
    return await executeCalculateTotalSale(productsData);
};

/**
 * @description Procesar pago de una orden
 */
const processOrderPayment = async (orderId, paymentMethodId) => {
    try {
        // Obtener la orden
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Orden no encontrada');
        }
        
        // Obtener el restaurante
        const restaurant = await Restaurant.findById(order.restaurantId)
            .populate('stripeAccount');
            
        if (!restaurant) {
            throw new Error('Restaurante no encontrado');
        }
        
        if (!restaurant.stripeAccount) {
            throw new Error('El restaurante no tiene cuenta Stripe conectada');
        }
        
        // Obtener la cuenta Stripe
        const stripeAccount = await StripeAccount.findById(restaurant.stripeAccount);
        if (!stripeAccount || !stripeAccount.chargesEnabled) {
            throw new Error('Cuenta Stripe del restaurante no está habilitada para cobros');
        }
        
        // Procesar pago con Stripe
        const stripeService = await import('../Stripe/stripe.service.js');
        const paymentIntent = await stripeService.default.processPayment(
            orderId,
            paymentMethodId,
            order.totalSale,
            restaurant._id,
            stripeAccount.stripeAccountId
        );
        
        // Actualizar estado de la orden
        order.paymentStatus = 'pagado';
        order.stripePaymentId = paymentIntent.id;
        await order.save();
        
        return paymentIntent;
    } catch (error) {
        console.error('Error procesando pago:', error);
        throw error;
    }
};

export default {
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
    getTop5ProductsByDateRangeAndRestaurantId,
    getOrdersByPaymentMethodByDateRangeAndRestaurantId,
    getTopCategoriesByDateRangeAndRestaurantId,
    calculateTotalSale,
    processOrderPayment
};