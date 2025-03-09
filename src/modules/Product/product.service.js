import Product from './product.model.js'; // Importar el modelo de producto

/**
 * @description Función para crear un nuevo producto
 * @param {*} productData 
 * @returns {Promise<Object>}
 */
const createProduct = async (productData) => {
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
    console.log(productId);
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return product;
    } catch (error) {
        console.error('Error al obtener el producto:', error);
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
 * @description Función para obtener productos por categoría
 * @param {String} categoryId
 * @returns {Promise<Object>}
 */
const getProductsByCategoryId = async (categoryId) => {
    return await Product.find({ category: categoryId }); // Obtener productos por categoría
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
export default {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByRestaurantId,
    getProductsByCategoryId,
    updateProduct,
    deleteProduct,
};
