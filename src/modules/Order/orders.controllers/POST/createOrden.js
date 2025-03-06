import orderService from './../../order.service.js'; // Importar el servicio de ordenes
import productService from './../../../Product/product.service.js'; // Importa el servicio de productos

/**
 * @description Controlador para crear una nueva orden
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {
    
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

export default handle;