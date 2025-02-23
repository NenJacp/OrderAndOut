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
    if (req.user.role !== 'admin') {
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
        orderData.createdByType = req.user.role;
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
async function getOrderById(req, res) {

    /**
     * @description Obtención de la orden
     */
    try {

        /**
         * @description Obtención de la orden
         * @constant {String} orderId
         */
        const orderId = req.body.id;

        /**
         * @description Obtención de la orden
         * @constant {Object} order
         */
        const order = await orderService.getOrderById(orderId);

        /**
         * @description Envío de la orden
         */
        res.status(200).send(order);
    } catch (error) {

        /**
         * @description Manejo de errores
         */
        res.status(500).send('Error al obtener la orden.');
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
async function updateOrder(req, res) {

    /**
     * @description Verificación de permisos para actualizar una orden
     */
    try {

        /**
         * @description Obtención de la orden
         * @constant {String} orderId
         */
        const orderId = req.body.id;

        /**
         * @description Obtención de la orden
         * @constant {Object} orderData
         */
        const orderData = req.body;

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
async function deleteOrder(req, res) {

    /**
     * @description Verificación de permisos para eliminar una orden
     */
    if (req.user.role !== 'admin') {
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
        const orderId = req.body.id;

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
    getOrderById,
    getAllOrders,
    getOrdersByRestaurantId,
    updateOrder,
    deleteOrder,
};