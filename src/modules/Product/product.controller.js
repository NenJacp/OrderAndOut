import productService from './product.service.js'; // Importar el repositorio

import categoryService from '../Category/category.service.js'; // Importar el modelo de categoría
import { urlencoded } from 'express';


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
        const nuevoProducto = await productService.createProduct({
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
        const productId = req.params.productId;
        const productData = req.body;

        // Validar campos requeridos
        if (!productId) {
            return res.status(400).json({ message: 'Se requiere ID del producto' });
        }

        const currentProduct = await productService.getProductById(productId);

        if (!currentProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (currentProduct.restaurantId.toString() !== req.user.restaurant.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar este producto' });
        }
        console.log(productData.costPrice, productData.salePrice);
        if (productData.costPrice && productData.salePrice ){
            if ( productData.costPrice >= productData.salePrice) {
                return res.status(400).json({ message: 'El precio de venta debe ser mayor al de costo' });
            }
        } 
        
        const updatedProduct = await productService.updateProduct(productId, productData);
        
        if (!updatedProduct) {
            return res.status(500).json({ message: 'Error al actualizar el producto' });
        }
       
        res.status(200).json({ 
            message: "Producto actualizado correctamente",
            product: updatedProduct
        });
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

    const  productId  = req.params.productId;

    try {
        const deletedProduct = await productService.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: "Producto eliminado correctamente"});
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
        const productId = req.params.productId;
        
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
        
        // Verificar si es usuario tipo kiosk para filtrar solo productos disponibles
        const onlyAvailable = req.user.type === 'kiosk';
        
        const products = await productService.getProductsByRestaurantId(req.user.restaurant, onlyAvailable);
        
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

    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Obtener productos por categoría
 * @param {*} req 
 * @param {*} res 
 */
const getProductsByCategory_CurrentUser = async (req, res) => {
    try {
        const categoryId = req.params.categoryId; // Obtener categoryId de los parámetros

        if (!categoryId) {
            return res.status(400).json({ message: 'Se requiere ID de categoría' });
        }

        // Verificar si es usuario tipo kiosk para filtrar solo productos disponibles
        const onlyAvailable = req.user.type === 'kiosk';
        
        const products = await productService.getProductsByCategoryId(categoryId, onlyAvailable);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos por categoría', error: error.message });
    }
};

/**
 * @description importacion
 */
export default {

    //ADMIN CONTROLLERS
    createProduct,
    updateProductById_CurrentAdmin,
    deleteProductById_CurrentAdmin,
    
    //KIOSK - ADMIN CONTROLLERS

    getProductById_CurrentUser,
    getProductsByRestaurant_CurrentUser,
 
    //DEVELOPER CONTROLLERS

    getAllProducts,
    getProductsByCategory_CurrentUser,
};
