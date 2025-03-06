import orderService from './../../order.service.js'; // Importar el servicio de ordenes

/**
 * @description Función para actualizar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).send('Solo los administradores pueden actualizar órdenes.');
    }

    /**
     * @description Verificación de permisos para actualizar una orden
     */
    try {

        /**
         * @description Obtención de la orden
         * @constant {String} orderId
         */
        const { orderId } = req.params.orderId;
        const { ...orderData } = req.body;

        /**
         * @description Obtención de la orden
         * @constant {Object} orderData
         */

        /**
         * @description Obtención de la orden
         * @constant {Object} order
         */
        const order = await orderService.getOrderById(orderId);
        /**
         * @description Verificación de la orden
         */
        if (!order) {
            return res.status(404).send('Orden no encontrada.');
        }

        /**
         * @description Verificación de la orden
         */
        if (order.restaurantId.toString() !== req.user.restaurant.toString()) {
            return res.status(403).send('La orden no pertenece al restaurante del usuario.');
        }

        /**
         * @description Actualización de la orden
         * @constant {Object} updatedOrder
         */ 
        const updatedOrder = await orderService.updateOrderById(orderId, orderData);

        /**
         * @description Envío de la orden
         */
        res.status(200).send(updatedOrder);
    } catch (error) {

        /**
         * @description Manejo de errores
         */
        console.error('Error al actualizar la orden:', error);
        res.status(500).send('Error al actualizar la orden.');
    }
}

export default handle;