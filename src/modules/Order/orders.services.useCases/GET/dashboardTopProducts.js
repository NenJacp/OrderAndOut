import Order from '../../order.model.js'; // Importación del modelo

/**
 * @description Servicio que obtiene los 5 productos más vendidos en un rango de fechas
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna un array con los 5 productos más vendidos
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

    const productCounts = {};

    orders.forEach(order => {
        order.products.forEach(product => {
            if (productCounts[product.productId]) {
                productCounts[product.productId] += product.quantity;
            } else {
                productCounts[product.productId] = product.quantity;
            }
        });
    });

    const sortedProducts = Object.entries(productCounts)
        .map(([productId, quantity]) => ({ productId, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Obtener los 5 productos más vendidos

    return sortedProducts;
};

export default execute;
