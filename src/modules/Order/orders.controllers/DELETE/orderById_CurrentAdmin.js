import orderService from './../../order.service.js'; // Importar el servicio de ordenes

/**
 * @description Función para eliminar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {

    /**
     * @description Verificación de permisos para eliminar una orden
     */
    if (req.user.type !== 'admin') {
        return res.status(403).send('Solo los administradores pueden eliminar órdenes.');
    }

    /**
     * @description Eliminación de la orden
     */
    try {

        /**
         * @description Obtención de la orden
         * @constant {String} orderId
         */
        const { orderId } = req.params.orderId;

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
         * @description Eliminación de la orden
         */
        await orderService.deleteOrderById(orderId);

        /**
         * @description Envío de la orden
         */
        res.status(200).send('Orden eliminada con éxito.');
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).send('Error al eliminar la orden.');
    }
}

export default handle;