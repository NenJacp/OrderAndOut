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

// Función para obtener todas las órdenes de un restaurante específico
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

// Nueva función para obtener el total de órdenes en un rango de fechas usando solo startDate para un restaurante específico
const getTotalOrdersByStartDateAndRestaurantId = async (startDate, restaurantId) => {
    try {
        // Ajustar endDate al final del día actual
        const endDate = new Date(); // Fecha actual
        endDate.setHours(23, 59, 59, 999); // Establecer a 23:59:59.999

        return await Order.countDocuments({
            createdAt: {
                $gte: new Date(startDate), // Fecha de inicio
                $lte: endDate // Fecha de fin ajustada
            },
            restaurantId // Filtrar por restaurantId
        });
    } catch (error) {
        throw new Error("Error al obtener el total de órdenes: " + error.message);
    }
};

// Nueva función para obtener el totalCost de las órdenes de un restaurante específico
const getTotalCostByRestaurantId = async (restaurantId) => {
    try {
        const orders = await getOrdersByRestaurantId(restaurantId); // Obtener órdenes del restaurante
        const totalCost = orders.reduce((total, order) => total + order.totalCost, 0); // Sumar totalCost de cada orden
        return totalCost;
    } catch (error) {
        throw new Error("Error al obtener el totalCost: " + error.message);
    }
};

// Nueva función para obtener el totalSale de las órdenes de un restaurante específico
const getTotalSaleByRestaurantId = async (restaurantId) => {
    try {
        const orders = await getOrdersByRestaurantId(restaurantId); // Obtener órdenes del restaurante
        const totalSale = orders.reduce((total, order) => total + order.totalSale, 0); // Sumar totalSale de cada orden
        return totalSale;
    } catch (error) {
        throw new Error("Error al obtener el totalSale: " + error.message);
    }
};

// Nueva función para obtener el totalGains de las órdenes de un restaurante específico
const getTotalGainsByRestaurantId = async (restaurantId) => {
    try {
        const totalCost = await getTotalCostByRestaurantId(restaurantId); // Obtener el totalCost
        const totalSale = await getTotalSaleByRestaurantId(restaurantId); // Obtener el totalSale
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

// Nueva función para obtener el totalCost en un rango de fechas para un restaurante específico
const getTotalCostByDateRangeAndRestaurantId = async (startDate, restaurantId) => {
    try {
        const orders = await Order.find({
            createdAt: {
                $gte: new Date(startDate), // Fecha de inicio
                $lte: new Date() // Hasta hoy
            },
            restaurantId // Filtrar por restaurantId
        }); // Obtener órdenes en el rango de fechas
        const totalCost = orders.reduce((total, order) => total + order.totalCost, 0); // Sumar totalCost de cada orden
        return totalCost;
    } catch (error) {
        throw new Error("Error al obtener el totalCost: " + error.message);
    }
};

// Nueva función para obtener el totalSale en un rango de fechas para un restaurante específico
const getTotalSaleByDateRangeAndRestaurantId = async (startDate, restaurantId) => {
    try {
        const orders = await Order.find({
            createdAt: {
                $gte: new Date(startDate), // Fecha de inicio
                $lte: new Date() // Hasta hoy
            },
            restaurantId // Filtrar por restaurantId
        }); // Obtener órdenes en el rango de fechas
        const totalSale = orders.reduce((total, order) => total + order.totalSale, 0); // Sumar totalSale de cada orden
        return totalSale;
    } catch (error) {
        throw new Error("Error al obtener el totalSale: " + error.message);
    }
};

// Nueva función para obtener el totalGains en un rango de fechas para un restaurante específico
const getTotalGainsByDateRangeAndRestaurantId = async (startDate, restaurantId) => {
    try {
        // Ajustar endDate al final del día actual
        const endDate = new Date(); // Fecha actual
        endDate.setHours(23, 59, 59, 999); // Establecer a 23:59:59.999

        const totalCost = await getTotalCostByDateRangeAndRestaurantId(startDate, restaurantId); // Obtener el totalCost
        const totalSale = await getTotalSaleByDateRangeAndRestaurantId(startDate, restaurantId); // Obtener el totalSale
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
    getTotalOrdersByStartDateAndRestaurantId, // Exportar la nueva función
    getTotalCostByRestaurantId, // Exportar la nueva función
    getTotalSaleByRestaurantId, // Exportar la nueva función
    getTotalGainsByRestaurantId, // Exportar la nueva función
    getTotalCostByDateRangeAndRestaurantId, // Exportar la nueva función
    getTotalSaleByDateRangeAndRestaurantId, // Exportar la nueva función
    getTotalGainsByDateRangeAndRestaurantId, // Exportar la nueva función
};
