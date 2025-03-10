import Order from '../../order.model.js'; // Importación del modelo

/**
 * @description Servicio que obtiene estadísticas de pago por método en un rango de fechas
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna un objeto con estadísticas de pago
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
};

export default execute;
