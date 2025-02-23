////////////////////////////////////////////////////////////
//                     Order Repository                    ///
////////////////////////////////////////////////////////////

const Order = require('./order.model'); // Importar el modelo de orden

// Función para crear una nueva orden
const createOrder = async (orderData) => {
    const newOrder = new Order(orderData);
    try {
        return await newOrder.save(); // Guardar en la base de datos
    } catch (error) {
        throw new Error("Error al crear la orden");
    }
};

// Función para obtener todas las órdenes
const getAllOrders = async () => {
    return await Order.find(); // Obtener todas las órdenes
};

// Función para obtener una orden específica por ID
const getOrderById = async (id) => {
    try {
        return await Order.findById(id); // Obtener una orden específica por ID
    } catch (error) {
        throw new Error("Error al obtener la orden");
    }
};

// Nueva función para obtener órdenes por ID de restaurante
const getOrdersByRestaurantId = async (restaurantId) => {
    return await Order.find({ restaurantId }); // Obtener órdenes filtradas por restaurantId
};

// Función para actualizar una orden
const updateOrderById = async (id, orderData) => {
    try {
        return await Order.findByIdAndUpdate(id, orderData); // Actualizar una orden
    } catch (error) {
        throw new Error("Error al actualizar la orden");
    }
};

const deleteOrderById = async (id) => {
    return await Order.findByIdAndDelete(id); // Eliminar la orden por ID
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById, // Exportar la función para obtener una orden específica
    getOrdersByRestaurantId, // Exportar la función para obtener órdenes por ID de restaurante
    updateOrderById, // Exportar la función para actualizar una orden
    deleteOrderById, // Exportar la función para eliminar una orden
};
