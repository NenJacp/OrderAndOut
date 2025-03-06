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
            restaurantId
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

// Exportar todas las funciones
export default {
    executeTotalOrdersByDateRangeAndRestaurantId,
    executeTotalCostByDateRangeAndRestaurantId,
    executeTotalSaleByDateRangeAndRestaurantId,
    executeTotalGainsByDateRangeAndRestaurantId,
};