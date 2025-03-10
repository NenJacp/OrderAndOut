import Order from '../../order.model.js'; // Importación del modelo

/**
 * @description Servicio que obtiene el total de órdenes en un rango de fechas por estado
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna un objeto con los totales de órdenes por estado y el total general
 */
const execute = async (startDate, endDate, restaurantId) => {
    const endDateAdjusted = new Date(endDate);
    endDateAdjusted.setHours(23, 59, 59, 999); // Ajusta la hora del endDate

    // Contar órdenes por estado
    const totalFinalizado = await Order.countDocuments({
        createdAt: {
            $gte: new Date(startDate),
            $lte: endDateAdjusted
        },
        restaurantId,
        status: 'finalizado' // Filtrar por estado finalizado
    });

    const totalPendiente = await Order.countDocuments({
        createdAt: {
            $gte: new Date(startDate),
            $lte: endDateAdjusted
        },
        restaurantId,
        status: 'pendiente' // Filtrar por estado pendiente
    });

    const totalPreparando = await Order.countDocuments({
        createdAt: {
            $gte: new Date(startDate),
            $lte: endDateAdjusted
        },
        restaurantId,
        status: 'preparando' // Filtrar por estado preparando
    });

    const totalCancelado = await Order.countDocuments({
        createdAt: {
            $gte: new Date(startDate),
            $lte: endDateAdjusted
        },
        restaurantId,
        status: 'cancelado' // Filtrar por estado cancelado
    });

    // Calcular el total general
    const totalGeneral = totalFinalizado + totalPendiente + totalPreparando + totalCancelado;

    return {
        totalFinalizado,
        totalPendiente,
        totalPreparando,
        totalCancelado,
        totalGeneral
    };
};

export default execute;
