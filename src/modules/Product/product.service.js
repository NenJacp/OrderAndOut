const Product = require('./product.model'); // Importar el modelo de producto

/**
 * @description Función para crear un nuevo producto
 * @param {*} productData 
 * @returns {Promise<Object>}
 */
const createProductByRestaurantId = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

/**
 * @description Función para obtener todos los productos
 * @returns {Promise<Object>}
 */
const getAllProducts = async () => {
    return await Product.find(); // Obtener todos los productos
};

/**
 * @description Función para obtener un producto por ID
 * @param {String} productId
 * @returns {Promise<Object>}
 */
const getProductById = async (productId) => {
    try {
        return await Product.findById(productId);
    } catch (error) {
        return null;
    }
};

/**
 * @description Función para obtener productos por ID del restaurante
 * @param {String} restaurantId
 * @returns {Promise<Object>}
 */
const getProductsByRestaurantId = async (restaurantId) => {
    return await Product.find({ restaurantId })
                       .sort({ creationDate: -1 })
                       .select('-__v');
};

/**
 * @description Función para actualizar un producto
 * @param {String} id
 * @param {Object} productData
 * @returns {Promise<Object>}
 */
const updateProduct = async (id, productData) => {
    try {
        return await Product.findByIdAndUpdate(id, productData);
    } catch (error) {
        return null;
    }
};

/**
 * @description Función para eliminar un producto
 * @param {String} id
 * @returns {Promise<Object>}
 */
const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id); // Eliminar producto
};

/**
 * @description Exportar las funciones del repositorio para su uso en otros módulos
 */
module.exports = {
    createProductByRestaurantId,
    getAllProducts,
    getProductById,
    getProductsByRestaurantId,
    updateProduct,
    deleteProduct,
};
