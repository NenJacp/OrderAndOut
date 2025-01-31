////////////////////////////////////////////////////////////
//                     Order Controller                    ///
////////////////////////////////////////////////////////////

const orderRepository = require('./orderRepository'); // Importar el repositorio
const fs = require('fs'); // Importar el módulo de sistema de archivos

// Función para generar un ticket
const generateTicket = (order) => {
    const ticketContent = `
    ------------------------------
    TICKET DE ORDEN
    ------------------------------
    ID de Orden: ${order._id}
    Fecha: ${order.creationDate.toLocaleDateString()}
    Hora: ${order.creationTime}
    Productos:
    ${order.products.map(item => `- ${item.productId} (Cantidad: ${item.quantity})`).join('\n')}
    Precio Total: $${order.totalPrice.toFixed(2)}
    Método de Pago: ${order.paymentMethod}
    Estado: ${order.status}
    ------------------------------
    Gracias por su compra!
    `;

    // Guardar el ticket en un archivo
    fs.writeFileSync(`tickets/ticket_${order._id}.txt`, ticketContent);
};

// Función para crear una nueva orden
const createOrder = async (req, res) => {
    const { items, total, paymentMethod } = req.body; // Desestructuración de datos
    const createdBy = req.userId; // Obtener el ID del usuario desde el token
    const createdByType = req.userType; // Obtener el tipo de usuario desde el token
    const restaurantId = req.params.idRestaurant; // Obtener el ID del restaurante de los parámetros

    if (!items || !total || !createdBy || !createdByType || !paymentMethod) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Generar un numOrder único
    const numOrder = `ORD-${Date.now()}`; // Ejemplo de generación de numOrder basado en la fecha actual

    try {
        // Crear la orden
        const newOrder = await orderRepository.createOrder({
            numOrder, // Asegúrate de incluir el numOrder aquí
            products: items,
            totalPrice: total,
            createdBy,
            createdByType,
            creationTime: new Date().toLocaleTimeString(),
            paymentMethod,
            restaurantId // Usar el ID del restaurante desde los parámetros
        });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nueva función para obtener órdenes por ID de restaurante
const getOrdersByRestaurantId = async (req, res) => {
    const { restaurantId } = req.params; // Obtener el ID del restaurante de los parámetros

    try {
        const orders = await orderRepository.getOrdersByRestaurantId(restaurantId); // Llamar al repositorio
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para este restaurante.' });
        }
        res.status(200).json(orders); // Devolver las órdenes encontradas
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener todas las órdenes
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderRepository.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la orden de los parámetros
    const updatedData = req.body; // Obtener los datos actualizados del cuerpo

    try {
        const updatedOrder = await orderRepository.updateOrder(id, updatedData); // Llamar al repositorio para actualizar la orden
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json(updatedOrder); // Responder con la orden actualizada
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la orden de los parámetros

    try {
        const deletedOrder = await orderRepository.deleteOrder(id); // Llamar al repositorio para eliminar la orden
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' }); // Manejo de no encontrado
        }
        res.status(204).send(); // Sin contenido
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByRestaurantId, // Exportar la nueva función
    updateOrder,
    deleteOrder, // Asegúrate de que esté exportada
};
