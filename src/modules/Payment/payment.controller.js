import paymentService from './payment.service.js'; // Importar el servicio de pagos
import orderService from './../Order/order.service.js'; // Importar el servicio de órdenes

/**
 * @description Controlador para procesar un pago
 * @param {object} req - Objeto de solicitud
 * @param {object} res - Objeto de respuesta
 */
const processPayment = async (req, res) => {
    const { numOrder, products, paymentMethod, notes, orderType, createdById, createdByType, restaurantId } = req.body;

    // Calcular el total de la orden
    let totalCost = 0;
    let totalSale = 0;

    for (const product of products) {
        const productDetails = await orderService.getProductById(product.productId); // Obtener detalles del producto
        if (productDetails) {
            totalCost += productDetails.costPrice * product.quantity; // Calcular costo total
            totalSale += productDetails.salePrice * product.quantity; // Calcular precio total de venta
        }
    }

    const currency = "MXN"; // Moneda en mayúsculas

    try {
        // Procesar el pago
        const paymentIntent = await paymentService.processPayment(totalCost, req.body.pago, req.body.cambio, paymentMethod, currency);

        // Crear la orden en la base de datos
        const orderData = {
            numOrder,
            products,
            totalCost,
            totalSale,
            status: 'pendiente',
            notes,
            createdById,
            createdByType,
            restaurantId,
            paymentMethod,
            currency,
            orderType,
        };

        const order = await orderService.createOrder(orderData); // Asegúrate de tener un método para crear la orden

        res.status(200).json({ clientSecret: paymentIntent.client_secret, order });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar el pago: ' + error.message });
    }
};

export default {
    processPayment,
}; 