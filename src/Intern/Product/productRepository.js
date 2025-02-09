////////////////////////////////////////////////////////////
//                     Product Repository                  ///
////////////////////////////////////////////////////////////

const Product = require('./productModel'); // Importar el modelo de producto

// Función para crear un nuevo producto
const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

// Función para obtener todos los productos
const getAllProducts = async () => {
    return await Product.find(); // Obtener todos los productos
};

// Función para obtener un producto por ID
const getProductById = async (productId) => {
    return await Product.findById(productId);
};

// Nueva función para obtener productos por ID del restaurante
const getProductsByRestaurantId = async (restaurantId) => {
    return await Product.find({ restaurantId }).sort({ creationTime: -1 });
};

// Función para actualizar un producto
const updateProduct = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true }); // Actualizar producto
};

// Función para eliminar un producto
const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id); // Eliminar producto
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByRestaurantId,
    updateProduct,
    deleteProduct,
};
