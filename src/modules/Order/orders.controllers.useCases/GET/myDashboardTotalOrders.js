import orderService from './../../order.service.js'; // Importar el servicio de órdenes

/**
 * @description Controlador para obtener el total de órdenes en el dashboard
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
        const totalOrders = await orderService.getTotalOrdersByDateRangeAndRestaurantId(start, end, restaurantId);
        res.status(200).json({
            success: true,
            data: totalOrders // Devolver los totales por estado
        });
    } catch (error) {
        console.error('Error en dashboard total orders controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el total de órdenes',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}

export default handle;
