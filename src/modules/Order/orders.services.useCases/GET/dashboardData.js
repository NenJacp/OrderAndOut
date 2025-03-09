import Order from '../../order.model.js'; // Importacion del modelo

/**
 * @description Servicio que obtiene el total de ordenes de un restaurante de "x" fecha a "x" fecha
 * @param {*} startDate recibe la fecha de incio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna el total de ordenes desde "x" fecha a "x" fecha
 */
export const executeTotalOrdersByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    try {
        const endDateAdjusted = new Date(endDate);
        endDateAdjusted.setHours(23, 59, 59, 999); // Ajusta la hora del endDate

        return await Order.countDocuments({
            createdAt: {
                $gte: new Date(startDate), // Fecha de inicio
                $lte: endDateAdjusted // Fecha de fin ajustada
            },
            restaurantId // Asegúrate de que este valor sea correcto
        });
    } catch (error) {
        throw new Error("Error al obtener el total de órdenes: " + error.message);
    }
};

/**
 * @description Servicio que obtiene el total de costos de los productos vendidos
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna el total de costos de "x" fecha a "x" fecha
 */
export const executeTotalCostByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    try {
        const endDateAdjusted = new Date(endDate);
        endDateAdjusted.setHours(23, 59, 59, 999); // Ajusta la hora del endDate

        const orders = await Order.find({
            createdAt: {
                $gte: new Date(startDate), // Fecha de inicio
                $lte: endDateAdjusted // Fecha de fin ajustada
            },
            restaurantId
        });
        const totalCost = orders.reduce((total, order) => total + order.totalCost, 0); // Sumar totalCost de cada orden
        return totalCost;
    } catch (error) {
        throw new Error("Error al obtener el totalCost: " + error.message);
    }
};

/**
 * @description Servicio que obtiene el total de venta de los productos vendidos
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna el total de venta de "x" fecha a "x" fecha
 */
export const executeTotalSaleByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    try {
        const endDateAdjusted = new Date(endDate);
        endDateAdjusted.setHours(23, 59, 59, 999); // Ajusta la hora del endDate

        const orders = await Order.find({
            createdAt: {
                $gte: new Date(startDate), // Fecha de inicio
                $lte: endDateAdjusted // Fecha de fin ajustada
            },
            restaurantId
        });
        const totalSale = orders.reduce((total, order) => total + order.totalSale, 0); // Sumar totalSale de cada orden
        return totalSale;
    } catch (error) {
        throw new Error("Error al obtener el totalSale: " + error.message);
    }
};

/**
 * @description Servicio que obtiene el total de ganancias de los productos vendidos
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna el total de ganancias de "x" fecha a "x" fecha
 */
export const executeTotalGainsByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    try {
        const totalCost = await executeTotalCostByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Obtener el totalCost
        const totalSale = await executeTotalSaleByDateRangeAndRestaurantId(startDate, endDate, restaurantId); // Obtener el totalSale
        const totalGains = totalSale - totalCost; // Calcular las ganancias
        return {
            totalCost,
            totalSale,
            totalGains
        };
    } catch (error) {
        throw new Error("Error al obtener el totalGains: " + error.message);
    }
};

/**
 * @description Servicio que obtiene los 5 productos más comprados en un rango de fechas para un restaurante específico
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna un array con los 5 productos más comprados
 */
export const executeTop5ProductsByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    try {
        const endDateAdjusted = new Date(endDate);
        endDateAdjusted.setHours(23, 59, 59, 999); // Ajustar la hora del endDate

        // Obtener todas las órdenes en el rango de fechas y del restaurante específico
        const orders = await Order.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: endDateAdjusted
            },
            restaurantId
        });

        // Crear un objeto para acumular las cantidades de productos
        const productCounts = {};

        // Acumular las cantidades de cada producto
        orders.forEach(order => {
            order.products.forEach(product => {
                if (productCounts[product.productId]) {
                    productCounts[product.productId] += product.quantity;
                } else {
                    productCounts[product.productId] = product.quantity;
                }
            });
        });

        // Convertir el objeto en un array y ordenar por cantidad
        const sortedProducts = Object.entries(productCounts)
            .map(([productId, quantity]) => ({ productId, quantity }))
            .sort((a, b) => b.quantity - a.quantity) // Ordenar de mayor a menor
            .slice(0, 5); // Obtener los 5 productos más comprados

        return sortedProducts;
    } catch (error) {
        throw new Error("Error al obtener los productos más comprados: " + error.message);
    }
};

/**
 * @description Servicio que obtiene estadísticas financieras por método de pago
 * @param {Date} startDate Fecha de inicio
 * @param {Date} endDate Fecha de fin
 * @param {ObjectId} restaurantId ID del restaurante
 * @returns {Object} Estadísticas detalladas por método de pago
 */
export const executeOrdersByPaymentMethodByDateRangeAndRestaurantId = async (startDate, endDate, restaurantId) => {
    try {
        const endDateAdjusted = new Date(endDate);
        endDateAdjusted.setHours(23, 59, 59, 999);

        // Obtener todas las órdenes en el rango
        const orders = await Order.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: endDateAdjusted
            },
            restaurantId,
            paymentMethod: { $in: ['efectivo', 'tarjeta'] }
        });

        // Función para calcular métricas
        const calculatePaymentStats = (paymentType) => {
            const filteredOrders = orders.filter(order => order.paymentMethod === paymentType);
            
            return {
                count: filteredOrders.length,
                cost: filteredOrders.reduce((sum, order) => sum + order.totalCost, 0),
                sale: filteredOrders.reduce((sum, order) => sum + order.totalSale, 0),
                profit: filteredOrders.reduce((sum, order) => sum + (order.totalSale - order.totalCost), 0)
            };
        };

        return {
            cash: calculatePaymentStats('efectivo'),
            card: calculatePaymentStats('tarjeta')
        };
        
    } catch (error) {
        throw new Error("Error al obtener estadísticas de pago: " + error.message);
    }
};

// Exportar todas las funciones
export default {
    executeTotalOrdersByDateRangeAndRestaurantId,
    executeTotalCostByDateRangeAndRestaurantId,
    executeTotalSaleByDateRangeAndRestaurantId,
    executeTotalGainsByDateRangeAndRestaurantId,
    executeTop5ProductsByDateRangeAndRestaurantId,
    executeOrdersByPaymentMethodByDateRangeAndRestaurantId,
};