import orderService from './../../order.service.js'; // Importar el servicio de ordenes

/**
 * @description Función para obtener una orden específica por ID
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {
    try {
        // Corregir nombre del campo (orderId en lugar de id)
        const orderId = req.params.orderId;
        
        if (!orderId) {
            return res.status(400).json({ message: 'Se requiere ID de orden' });
        }
        
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        // Verificar pertenencia  al restaurante
        if (order.restaurantId.toString() !== req.user.restaurant.toString()) {
            return res.status(403).json({ message: 'Orden no pertenece a tu restaurante' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({ 
            message: 'Error al obtener orden',
            error: error.message
        });
    }
}

export default handle;