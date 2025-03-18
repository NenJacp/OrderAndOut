import orderService from '../../order.service.js'; // Importar el servicio de órdenes
import productService from '../../../Product/product.service.js'; // Importar el servicio de productos
import categoryService from '../../../Category/category.service.js'; // Importar el servicio de categorías
import restaurantService from '../../../Restaurant/restaurant.service.js'; // Importar el servicio de restaurantes

/**
 * @description Controlador para crear una nueva orden
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {

    /**
     * @description Creación de la orden
     */
    try {
        const orderData = req.body;
        
        // Verificar que customerName exista en el body
        if (!orderData.customerName) {
            return res.status(400).send('El campo customerName es requerido');
        }

        // Obtener los productos y sus precios
        const productsWithDetails = await Promise.all(orderData.products.map(async (product) => {
            const productDetails = await productService.getProductById(product.productId); // Obtener detalles del producto
            if (!productDetails) {
                throw new Error(`Producto no encontrado: ${product.productId}`);
            }
            return {
                productId: product.productId,
                quantity: product.quantity,
                costPrice: productDetails.costPrice,
                salePrice: productDetails.salePrice,
                name: productDetails.name, // Agregar el nombre del producto
                category: {
                    id: productDetails.category, // ID de la categoría
                    name: (await categoryService.getCategoryById(productDetails.category)).name // Obtener el nombre de la categoría
                }
            };
        }));

        // Calcular el totalCost y totalSale
        const totalCost = productsWithDetails.reduce((total, product) => {
            return total + (product.costPrice * product.quantity);
        }, 0);

        const totalSale = productsWithDetails.reduce((total, product) => {
            return total + (product.salePrice * product.quantity);
        }, 0);
        
        // Obtener el nombre del restaurante
        const restaurantDetails = await restaurantService.getRestaurantById(req.user.restaurant);
        if (!restaurantDetails) {
            throw new Error(`Restaurante no encontrado: ${req.user.restaurant}`);
        }

        // Asignar datos adicionales
        orderData.createdById = req.user.id;
        orderData.createdByType = req.user.type;
        orderData.restaurantId = req.user.restaurant;
        orderData.restaurantName = restaurantDetails.name; // Agregar el nombre del restaurante
        orderData.products = productsWithDetails; // Actualizar productos con detalles
        orderData.totalCost = totalCost; // Asignar el totalCost
        orderData.totalSale = totalSale; // Asignar el totalSale
        orderData.createdByName = req.user.name; // Agregar el nombre del usuario que crea la orden

        /**
         * @description Creación de la orden
         * @constant {Object} newOrder
         */
        const newOrder = await orderService.createOrder(orderData);
        
        // Generar URL de pago si se especifica paymentMethod como 'tarjeta'
        if (orderData.paymentMethod === 'tarjeta') {
            try {
                const stripeService = await import('../../../Stripe/stripe.paymentService.js');
                const paymentUrl = await stripeService.default.generatePaymentUrl(
                    newOrder._id,
                    newOrder.restaurantId,
                    newOrder.totalSale
                );
                
                // Actualizar la orden con la URL de pago
                newOrder.stripePaymentUrl = paymentUrl;
                await newOrder.save();
                
                // Incluir URL de pago en la respuesta
                res.status(201).json({
                    order: newOrder,
                    paymentUrl: paymentUrl
                });
            } catch (error) {
                console.error('Error generando URL de pago:', error);
                // Aún devolver la orden creada aunque falle el pago
                res.status(201).json({
                    order: newOrder,
                    error: `Error generando URL de pago: ${error.message}`
                });
            }
        } else {
            // Si no es pago con tarjeta, simplemente devolver la orden
            res.status(201).json({ order: newOrder });
        }
    } catch (error) {
        res.status(500).send('Error al crear la orden: ' + error.message);
    }
}

export default handle;