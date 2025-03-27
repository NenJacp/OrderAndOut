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
    
    try {
        const product = await Product.findById(productId);
        
        return product;
    } catch (error) {
        throw new Error(`Error al obtener el producto: ${error.message}`);
    }
};

/**
 * @description Función para obtener productos por ID del restaurante
 * @param {String} restaurantId
 * @param {Boolean} onlyAvailable - Indica si solo devolver productos disponibles
 * @returns {Promise<Object>}
 */
const getProductsByRestaurantId = async (restaurantId, onlyAvailable = false) => {
    let query = { restaurantId };
    
    // Si solo se requieren productos disponibles, añadir al filtro
    if (onlyAvailable) {
        query.availability = true;
    }
    
    return await Product.find(query)
                       .sort({ creationDate: -1 })
                       .select('-__v');
};

/**
 * @description Función para obtener productos por categoría
 * @param {String} categoryId
 * @param {Boolean} onlyAvailable - Indica si solo devolver productos disponibles
 * @returns {Promise<Object>}
 */
const getProductsByCategoryId = async (categoryId, onlyAvailable = false) => {
    let query = { category: categoryId };
    
    // Si solo se requieren productos disponibles, añadir al filtro
    if (onlyAvailable) {
        query.availability = true;
    }
    
    return await Product.find(query);
};

/**
 * @description Función para actualizar un producto
 * @param {String} id
 * @param {Object} productData
 * @returns {Promise<Object>}
 */
const updateProduct = async (id, productData) => {
    try {
        // Usar findByIdAndUpdate con la opción new:true para devolver el documento actualizado
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            productData,
            { 
                new: true,       // Devuelve el documento actualizado
                runValidators: true  // Ejecuta validadores de esquema
            }
        );
        
        if (!updatedProduct) {
            throw new Error(`No se encontró el producto con ID: ${id}`);
        }
        
        return updatedProduct;
    } catch (error) {
        console.error(`Error al actualizar el producto: ${error.message}`);
        throw error; // Propaga el error para manejo adecuado
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
