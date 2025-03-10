import orderService from './../../order.service.js'; // Importar el servicio de ordenes

/**
 * @description Función para obtener órdenes por ID de restaurante
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).send('No tiene acceso a esta función porque no es administrador.');
    }
    /**
     * @description Obtención de las órdenes por ID de restaurante
     */
    try {

        const restaurantId = req.user.restaurant;

        const orders = await orderService.getOrdersByRestaurantId(restaurantId);

        if (!orders) {
            return res.status(404).send('No se encontraron órdenes para este restaurante.');
        }

        res.status(200).send(orders);
    } catch (error) {

        /**
         * @description Manejo de errores
         */
        res.status(500).send('Error al obtener las órdenes del restaurante.');
    }
}

export default handle;