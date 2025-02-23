const orderService = require('./order.service'); // Importar el servicio

/**
 * @description Función para crear una nueva orden
 * @param {Object} req 
 * @param {Object} res 
 */
async function createOrder(req, res) {
    
    /**
     * @description Verificación de permisos para crear una orden
     */
    if (req.user.type !== 'admin') {
        return res.status(403).send('Solo los administradores pueden crear órdenes.');
    }

    /**
     * @description Creación de la orden
     */
    try {

        /**
         * @description Datos de la orden
         * @constant {Object} orderData
         */
        const orderData = req.body;
        orderData.createdById = req.user.id;
        orderData.createdByType = req.user.type;
        orderData.restaurantId = req.user.restaurant;
        /**
         * @description Creación de la orden
         * @constant {Object} newOrder
         */
        const newOrder = await orderService.createOrder(orderData);
        res.status(201).send(newOrder);
    } catch (error) {

        /**
         * @description Manejo de errores
         */
        res.status(500).send('Error al crear la orden.');
    }
}

/**
 * @description Función para obtener una orden específica por ID
 * @param {Object} req 
 * @param {Object} res 
 */
async function getOrderById_JWT(req, res) {
    try {
        // Corregir nombre del campo (orderId en lugar de id)
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({ message: 'Se requiere ID de orden' });
        }
        
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        // Verificar pertenencia al restaurante
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

/**
 * @description Función para obtener todas las órdenes
 * @param {Object} req 
 * @param {Object} res 
 */
async function getAllOrders(req, res) {

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

/**
 * @description Función para obtener órdenes por ID de restaurante
 * @param {Object} req 
 * @param {Object} res 
 */
async function getOrdersByRestaurantId(req, res) {

    /**
     * @description Obtención de las órdenes por ID de restaurante
     */
    try {
        const restaurantId = req.user.restaurant;
        const orders = await orderService.getOrdersByRestaurantId(restaurantId);
        res.status(200).send(orders);
    } catch (error) {

        /**
         * @description Manejo de errores
         */
        res.status(500).send('Error al obtener las órdenes del restaurante.');
    }
}

/**
 * @description Función para actualizar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
async function updateOrderById_JWT(req, res) {

    /**
     * @description Verificación de permisos para actualizar una orden
     */
    try {

        /**
         * @description Obtención de la orden
         * @constant {String} orderId
         */
        const { orderId, ...orderData } = req.body;

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

/**
 * @description Función para eliminar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
async function deleteOrderById_JWT(req, res) {

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
        const { orderId } = req.body;

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

module.exports = {
    createOrder,
    getOrderById_JWT,
    getAllOrders,
    getOrdersByRestaurantId,
    updateOrderById_JWT,
    deleteOrderById_JWT,
};