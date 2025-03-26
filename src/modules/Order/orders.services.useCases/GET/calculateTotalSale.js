import Product from '../../../Product/product.model.js'; // Importar el modelo de producto

/**
 * @description Calcula el total de venta basado en IDs de productos y cantidades
 * @param {Array} productsData Array de objetos con productId y quantity
 * @returns {Number} Total de venta calculado
 */
const execute = async (productsData) => {
    try {
        // Extraer todos los IDs de productos
        const productIds = productsData.map(item => item.productId);
        
        // Obtener los productos en una sola consulta
        const products = await Product.find({ _id: { $in: productIds } });
        
        // Crear mapa para acceso rápido
        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = product;
        });
        
        // Calcular el total de venta
        let totalSale = 0;
        for (const item of productsData) {
            const product = productMap[item.productId.toString()];
            if (!product) {
                throw new Error(`Producto no encontrado: ${item.productId}`);
            }
            totalSale += product.salePrice * item.quantity;
        }

        return totalSale;
    } catch (error) {
        throw new Error("Error al calcular el total de venta: " + error.message);
    }
};

export default execute; 

