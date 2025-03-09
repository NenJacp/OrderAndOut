import orderService from './../../order.service.js'; // Importar el servicio de ordenes

/**
 * @description Controlador principal para el dashboard con múltiples estadísticas
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const handle = async (req, res) => {
    const restaurantId = req.user.restaurant;
    const { startDate, endDate } = req.query;

    // Validación básica de parámetros
    if (!restaurantId) {
        return res.status(403).json({ message: 'Acceso no autorizado - Restaurante no asignado' });
    }

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Se requieren las fechas de inicio y fin' });
    }

    // Conversión y validación de fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD' });
    }

    if (start >= end) {
        return res.status(400).json({ message: 'La fecha de inicio debe ser menor que la fecha de fin' });
    }

    // Ajuste de hora final
    end.setHours(23, 59, 59, 999);

    try {
        // Ejecutar todas las consultas en paralelo
        const [
            totalOrders,
            financialData,
            topProducts,
            paymentMethods
        ] = await Promise.all([
            orderService.getTotalOrdersByStartDateAndRestaurantId(start, restaurantId),
            orderService.getTotalGainsByDateRangeAndRestaurantId(start, restaurantId),
            orderService.getTop5ProductsByDateRangeAndRestaurantId(start, end, restaurantId),
            orderService.getOrdersByPaymentMethodByDateRangeAndRestaurantId(start, end, restaurantId)
        ]);

        // Construir respuesta consolidada
        res.status(200).json({
            success: true,
            data: {
                period: {
                    start: start.toISOString(),
                    end: end.toISOString()
                },
                totals: {
                    orders: totalOrders,
                    cost: financialData.totalCost,
                    sales: financialData.totalSale,
                    profit: financialData.totalGains
                },
                products: {
                    top5: topProducts
                },
                payments: paymentMethods
            }
        });

    } catch (error) {
        console.error('Error en dashboard controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error completo al generar el dashboard',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}

export default handle;
