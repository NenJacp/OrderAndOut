import Order from '../../order.model.js'; // Importación del modelo

/**
 * @description Servicio que obtiene el total de ventas de las órdenes finalizadas en un rango de fechas
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna el total de ventas
 */
const execute = async (startDate, endDate, restaurantId) => {
    const endDateAdjusted = new Date(endDate);
    endDateAdjusted.setHours(23, 59, 59, 999); // Ajusta la hora del endDate

    const orders = await Order.find({
        createdAt: {
            $gte: new Date(startDate),
            $lte: endDateAdjusted
        },
        restaurantId,
        status: 'finalizado' // Filtrar solo órdenes finalizadas
    });

    const totalSale = orders.reduce((total, order) => total + order.totalSale, 0);
    return totalSale;
};

export default execute;
