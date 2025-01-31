////////////////////////////////////////////////////////////
//                     Order Repository                    ///
////////////////////////////////////////////////////////////

const Order = require('./orderModel'); // Importar el modelo de orden

// Función para crear una nueva orden
const createOrder = async (orderData) => {
    const newOrder = new Order(orderData);
    return await newOrder.save(); // Guardar en la base de datos
};

// Función para obtener todas las órdenes
const getAllOrders = async () => {
    return await Order.find(); // Obtener todas las órdenes
};

// Nueva función para obtener órdenes por ID de restaurante
const getOrdersByRestaurantId = async (restaurantId) => {
    return await Order.find({ restaurantId }); // Obtener órdenes filtradas por restaurantId
};

const deleteOrder = async (id) => {
    return await Order.findByIdAndDelete(id); // Eliminar la orden por ID
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByRestaurantId, // Exportar la nueva función
    deleteOrder, // Asegúrate de que esté exportada
};
