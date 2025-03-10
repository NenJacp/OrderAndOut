import orderService from './../../order.service.js'; // Importar el servicio de órdenes

/**
 * @description Controlador para obtener los 5 productos más vendidos en el dashboard
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const handle = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'Acceso no autorizado - Solo los administradores pueden acceder a este recurso' });
    }
    
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
        const topProducts = await orderService.getTop5ProductsByDateRangeAndRestaurantId(start, end, restaurantId);
        res.status(200).json({
            success: true,
            data: topProducts
        });
    } catch (error) {
        console.error('Error en dashboard top products controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos más vendidos',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}

export default handle;
