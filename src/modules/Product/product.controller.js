const productService = require('./product.service'); // Importar el repositorio
const authService = require('../Auth/auth.service'); // Importar funciones de hashing
const categoryService = require('../Category/category.service'); // Importar el modelo de categoría


//ADMIN CONTROLLERS

/**
 * @description Crear un nuevo producto
 * @param {*} req 
 * @param {*} res 
 */
const createProduct = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permiso para crear productos' });
    }

    const { name, description, image, costPrice, salePrice, category, ingredients } = req.body;

    // Validar campos obligatorios
    if (!name || !description || !image || !costPrice || !salePrice || !category || !ingredients) {
        return res.status(400).json({
            message: 'Campos requeridos faltantes'
        });
    }

    try {

        // Convertir y validar precios
        const numericCost = parseFloat(costPrice);
        const numericSale = parseFloat(salePrice);
        
        if (isNaN(numericCost) || isNaN(numericSale)) {
            return res.status(400).json({ 
                message: 'Los precios deben ser valores numéricos' 
            });
        }

        if (numericSale <= numericCost) {
            return res.status(400).json({ 
                message: 'El precio de venta debe ser mayor al de costo' 
            });
        }

        // Verificar existencia de categoría
        const categoriaValida = await categoryService.getCategoryById(category);

        if (!categoriaValida) {
            return res.status(400).json({ 
                message: 'Categoría no existe o no pertenece a tu restaurante' 
            });
        }

        // Crear nuevo producto
        const nuevoProducto = await productService.createProductByRestaurantId({
            name,
            description: description || '',
            image,
            costPrice: numericCost,
            salePrice: numericSale,
            category,
            ingredients: ingredients || [],
            restaurantId: req.user.restaurant, // Obtenido del JWT
            available: true
        });

        res.status(201).json({ "message": "Producto creado correctamente" });

    } catch (error) {
        console.error('Error al crear producto:', error);
        const mensaje = error.name === 'ValidationError' 
            ? 'Datos del producto inválidos: ' + error.message
            : 'Error interno del servidor';
        res.status(500).json({ message: mensaje });
    }
};


/**
 * @description Actualizar un producto por ID
 * @param {*} req 
 * @param {*} res 
 */
const updateProductById_CurrentAdmin = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permiso para actualizar productos' });
    }

    try {

        const { productId } = req.params.productId;
        const { ...productData } = req.body;

        // Validar campos requeridos
        if (!productId) {
            return res.status(400).json({ message: 'Se requiere ID del producto' });
        }

        const currentProduct = await productService.getProductById(productId);

        if (currentProduct.restaurantId.toString() !== req.user.restaurant.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar este producto' });
        }

        if (currentProduct.costPrice >= productData.salePrice) {
            return res.status(400).json({ message: 'El precio de venta debe ser mayor al de costo' });
        }

        const updatedProduct = await productService.updateProduct(productId, productData);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ "message": "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar',
            error: error.message
        });
    }
};


/**
 * @description Eliminar un producto por ID
 * @param {*} req 
 * @param {*} res 
 */
const deleteProductById_CurrentAdmin = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permiso para eliminar productos' });
    }

    const { productId } = req.params.productId;

    try {
        const deletedProduct = await productService.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(204).send("Producto eliminado correctamente");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// KIOSK - ADMIN CONTROLLERS

/**
 * @description Obtener un producto por ID
 * @param {*} req 
 * @param {*} res 
 */
const getProductById_CurrentUser = async (req, res) => {
    try {
        // Corregir la desestructuración
        const { productId } = req.params.productId;
        
        // Validar ID primero
        if (!productId) {
            return res.status(400).json({ message: 'Se requiere ID de producto' });
        }

        const product = await productService.getProductById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar pertenencia al restaurante (ajustar según tu modelo)
        if (product.restaurantId.toString() !== req.user.restaurant.toString()) {
            return res.status(403).json({ message: 'Producto no pertenece a tu restaurante' });
        }

        res.status(200).json({ product });
    } catch (error) {

        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
};

/**
 * @description Obtener productos por ID del restaurante
 * @param {*} req 
 * @param {*} res 
 */
const getProductsByRestaurant_CurrentUser = async (req, res) => {

    try {
        if (req.user.restaurant === 'Empty') {
            return res.status(400).json({ message: 'Primero debes crear un restaurante' });
        }
        
        const products = await productService.getProductsByRestaurantId(req.user.restaurant);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//DEVELOPER CONTROLLERS


/**
 * @description Obtener todos los productos
 * @param {*} req 
 * @param {*} res 
 */
const getAllProducts = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permiso para obtener productos' });
    }

    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsById = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permiso para obtener productos' });
    }

    try {
        const { productId } = req.params.productId;
        const product = await productService.getProductById(productId);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProductById = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permiso para actualizar productos' });
    }

    try {
        const { productId } = req.params.productId;
        const { ...productData } = req.body;
        const updatedProduct = await productService.updateProduct(productId, productData);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteProductById = async (req, res) => {

    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permiso para eliminar productos' });
    }

    try {
        const { productId } = req.params.productId;
        const deletedProduct = await productService.deleteProduct(productId);
        res.status(204).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   
module.exports = {

    //ADMIN CONTROLLERS
    createProduct,
    updateProductById_CurrentAdmin,
    deleteProductById_CurrentAdmin,
    
    //KIOSK - ADMIN CONTROLLERS

    getProductById_CurrentUser,
    getProductsByRestaurant_CurrentUser,
 
    //DEVELOPER CONTROLLERS

    getAllProducts,
    getProductsById,
    updateProductById,
    deleteProductById,
};
