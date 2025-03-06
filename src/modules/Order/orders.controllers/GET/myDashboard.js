import orderService from './../../order.service.js'; // Importar el servicio de ordenes

/**
 * @description Función para obtener el dashboard del usuario actual con totales de órdenes y ganancias en un rango de fechas
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {
    const restaurantId = req.user.restaurant; // Obtener el restaurantId del usuario actual
    const { startDate, endDate } = req.query; // Obtener las fechas del query

    // Validar las fechas
    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Se requieren las fechas de inicio y fin' });
    }

    // Convertir las fechas a objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Verificar que startDate sea menor que endDate
    if (start >= end) {
        return res.status(400).json({ message: 'La fecha de inicio debe ser menor que la fecha de fin' });
    }

    // Ajustar endDate para incluir hasta la última hora del día
    end.setHours(23, 59, 59, 999); // Establecer a 23:59:59.999

    try {
        // Obtener el total de órdenes en el rango de fechas
        const totalOrders = await orderService.getTotalOrdersByStartDateAndRestaurantId(start, restaurantId);
        
        // Obtener el total de ganancias en el rango de fechas
        const { totalCost, totalSale, totalGains } = await orderService.getTotalGainsByDateRangeAndRestaurantId(start, restaurantId);

        // Devolver los resultados
        res.status(200).json({
            totalOrders,
            totalCost,
            totalSale,
            totalGains
        });
    } catch (error) {
        console.error('Error al obtener el dashboard:', error.message);
        res.status(500).json({ message: 'Error al obtener el dashboard', error: error.message });
    }
}

export default handle;
