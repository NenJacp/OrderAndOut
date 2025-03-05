import Order from './order.model.js'; // Importar el modelo de orden

// Función para crear una nueva orden
const createOrder = async (orderData) => {
    const newOrder = new Order(orderData);
    try {
        return await newOrder.save(); // Guardar en la base de datos
    } catch (error) {
        throw new Error("Error al crear la orden: " + error.message);
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

// Nueva función para obtener el total de órdenes en un rango de fechas
const getTotalOrdersByDateRange = async (startDate, endDate) => {
    try {
        // Ajustar endDate al final del día
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999); // Establecer a 23:59:59.999

        return await Order.countDocuments({
            createdAt: {
                $gte: new Date(startDate), // Fecha de inicio
                $lte: adjustedEndDate // Fecha de fin ajustada
            }
        });
    } catch (error) {
        throw new Error("Error al obtener el total de órdenes: " + error.message);
    }
};

// Nueva función para obtener el totalCost de todas las órdenes
const getTotalCost = async () => {
    try {
        const orders = await Order.find(); // Obtener todas las órdenes
        const totalCost = orders.reduce((total, order) => total + order.totalCost, 0); // Sumar totalCost de cada orden
        return totalCost;
    } catch (error) {
        throw new Error("Error al obtener el totalCost: " + error.message);
    }
};

const getTotalSale = async () => {
    try {
        const orders = await Order.find(); // Obtener todas las órdenes
        const totalSale = orders.reduce((total, order) => total + order.totalSale, 0); // Sumar totalSale de cada orden
        return totalSale;
    } catch (error) {
        throw new Error("Error al obtener el totalSale: " + error.message);
    }
};

const getTotalGains = async () => {
    try {
        const totalCost = await getTotalCost(); // Obtener el totalCost
        const totalSale = await getTotalSale(); // Obtener el totalSale
        const totalGains = totalSale - totalCost; // Calcular las ganancias
        return {
            totalCost,
            totalSale,
            totalGains
        };
    } catch (error) {
        throw new Error("Error al obtener el totalGains: " + error.message);
    }
};

export default {
    createOrder,
    getAllOrders,
    getOrderById, // Exportar la función para obtener una orden específica
    getOrdersByRestaurantId, // Exportar la función para obtener órdenes por ID de restaurante
    updateOrderById, // Exportar la función para actualizar una orden
    deleteOrderById, // Exportar la función para eliminar una orden
    getTotalOrdersByDateRange, // Exportar la nueva función
    getTotalCost, // Exportar la nueva función
    getTotalSale,
    getTotalGains,
};
