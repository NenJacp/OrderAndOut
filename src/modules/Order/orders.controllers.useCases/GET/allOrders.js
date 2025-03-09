import orderService from './../../order.service.js'; // Importar el servicio de ordenes

/**
 * @description Función para obtener todas las órdenes
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {

    /**
     * @description Obtención de todas las órdenes
     */
    try {

        /**
         * @description Obtención de todas las órdenes
         */
        const orders = await orderService.getAllOrders();

        /**
         * @description Envío de las órdenes
         */
        res.status(200).send(orders);
    } catch (error) {

        /**
         * @description Manejo de errores
         */
        res.status(500).send('Error al obtener las órdenes.');
    }
}

export default handle;