import orderService from '../../order.service.js'; // Importar el servicio de órdenes
import productService from '../../../Product/product.service.js'; // Importar el servicio de productos
import categoryService from '../../../Category/category.service.js'; // Importar el servicio de categorías

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

        // Asignar datos adicionales
        orderData.createdById = req.user.id;
        orderData.createdByType = req.user.type;
        orderData.restaurantId = req.user.restaurant;
        orderData.products = productsWithDetails; // Actualizar productos con detalles
        orderData.totalCost = totalCost; // Asignar el totalCost
        orderData.totalSale = totalSale; // Asignar el totalSale
        orderData.createdByName = req.user.name; // Agregar el nombre del usuario que crea la orden

        /**
         * @description Creación de la orden
         * @constant {Object} newOrder
         */
        const newOrder = await orderService.createOrder(orderData);
        res.status(201).send(newOrder);
    } catch (error) {
        res.status(500).send('Error al crear la orden: ' + error.message);
    }
}

export default handle;