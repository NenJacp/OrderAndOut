import orderService from './order.service.js'; // Importar el servicio
import productService from '../Product/product.service.js';

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
        const orderData = req.body;
        console.log("Datos recibidos del front:", orderData);

        // Obtener los productos y sus precios
        const productsWithPrices = await Promise.all(orderData.products.map(async (product) => {
            const productDetails = await productService.getProductById(product.productId); // Obtener detalles del producto
            if (!productDetails) {
                throw new Error(`Producto no encontrado: ${product.productId}`);
            }
            return {
                productId: product.productId,
                quantity: product.quantity,
                costPrice: productDetails.costPrice,
                salePrice: productDetails.salePrice,
            };
        }));

        console.log("Productos con precios:", productsWithPrices);

        // Calcular el totalCost y totalSale
        const totalCost = productsWithPrices.reduce((total, product) => {
            return total + (product.costPrice * product.quantity);
        }, 0);

        const totalSale = productsWithPrices.reduce((total, product) => {
            return total + (product.salePrice * product.quantity);
        }, 0);

        // Asignar datos adicionales
        orderData.createdById = req.user.id;
        orderData.createdByType = req.user.type;
        orderData.restaurantId = req.user.restaurant;
        orderData.products = productsWithPrices; // Actualizar productos con precios
        orderData.totalCost = totalCost; // Asignar el totalCost
        orderData.totalSale = totalSale; // Asignar el totalSale

        /**
         * @description Creación de la orden
         * @constant {Object} newOrder
         */
        const newOrder = await orderService.createOrder(orderData);
        res.status(201).send(newOrder);
    } catch (error) {
        console.error('Error al crear la orden:', error.message);
        res.status(500).send('Error al crear la orden: ' + error.message);
    }
}

/**
 * @description Función para obtener una orden específica por ID
 * @param {Object} req 
 * @param {Object} res 
 */
async function getOrderById_CurrentUser(req, res) {
    try {
        // Corregir nombre del campo (orderId en lugar de id)
        const { orderId } = req.params.orderId;
        
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
 * @description Función para obtener órdenes por ID de restaurante
 * @param {Object} req 
 * @param {Object} res 
 */
async function getOrdersByRestaurant_CurrentUser(req, res) {

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

/**
 * @description Función para actualizar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
async function updateOrderById_CurrentAdmin(req, res) {

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

/**
 * @description Función para eliminar una orden
 * @param {Object} req 
 * @param {Object} res 
 */
async function deleteOrderById_CurrentAdmin(req, res) {

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

// DEVELOPER CONTROLLERS
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
 * @description Función para obtener el total de órdenes en un rango de fechas
 * @param {Object} req 
 * @param {Object} res 
 */
async function getTotalOrdersByDateRange(req, res) {

    if (req.user.type !== 'admin') {
        return res.status(403).send('Solo los administradores pueden eliminar órdenes.');
    }
    
    const { startDate, endDate } = req.query; // Obtener las fechas del query

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Se requieren las fechas de inicio y fin' });
    }

    try {
        const totalOrders = await orderService.getTotalOrdersByDateRange(startDate, endDate);
        res.status(200).json({ totalOrders });
    } catch (error) {
        console.error('Error al obtener el total de órdenes:', error.message);
        res.status(500).json({ message: 'Error al obtener el total de órdenes', error: error.message });
    }
}

/**
 * @description Función para obtener el totalCost de todas las órdenes
 * @param {Object} req 
 * @param {Object} res 
 */
async function getTotalCost(req, res) {

    if (req.user.type !== 'admin') {
        return res.status(403).send('Solo los administradores pueden eliminar órdenes.');
    }

    try {
        const totalCost = await orderService.getTotalCost(); // Llamar al servicio para obtener el totalCost
        res.status(200).json({ totalCost }); // Devolver el totalCost
    } catch (error) {
        console.error('Error al obtener el totalCost:', error.message);
        res.status(500).json({ message: 'Error al obtener el totalCost', error: error.message });
    }
}

/**
 * @description Función para obtener el totalSale de todas las órdenes
 * @param {Object} req 
 * @param {Object} res 
 */
async function getTotalSale(req, res) {

    if (req.user.type !== 'admin') {
        return res.status(403).send('Solo los administradores pueden eliminar órdenes.');
    }

    try {
        const totalSale = await orderService.getTotalSale(); // Llamar al servicio para obtener el totalSale
        res.status(200).json({ totalSale }); // Devolver el totalSale
    } catch (error) {
        console.error('Error al obtener el totalSale:', error.message);
        res.status(500).json({ message: 'Error al obtener el totalSale', error: error.message });
    }
}

/**
 * @description Función para obtener el totalGains de todas las órdenes
 * @param {Object} req 
 * @param {Object} res 
 */
async function getTotalGains(req, res) {

    if (req.user.type !== 'admin') {
        return res.status(403).send('Solo los administradores pueden eliminar órdenes.');
    }

    try {
        const { totalCost, totalSale, totalGains } = await orderService.getTotalGains(); // Llamar al servicio para obtener el totalGains
        res.status(200).json({ totalCost, totalSale, totalGains }); // Devolver el totalCost, totalSale y totalGains
    } catch (error) {
        console.error('Error al obtener el totalGains:', error.message);
        res.status(500).json({ message: 'Error al obtener el totalGains', error: error.message });
    }
}

export default {
    createOrder,
    getOrderById_CurrentUser,
    getOrdersByRestaurant_CurrentUser,
    updateOrderById_CurrentAdmin,
    deleteOrderById_CurrentAdmin,

    getAllOrders,
    getTotalOrdersByDateRange,
    getTotalCost,
    getTotalSale,
    getTotalGains,
};