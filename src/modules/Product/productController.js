////////////////////////////////////////////////////////////
//                     Product Controller                ///
////////////////////////////////////////////////////////////

const productRepository = require('./productRepository'); // Importar el repositorio
const { hasher } = require('../Auth/auth.service'); // Importar funciones de hashing
const Category = require('../Category/category.model'); // Importar el modelo de categoría
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////
//                     CREATE SECTION                    ///
////////////////////////////////////////////////////////////

// Función para crear un nuevo producto
const createProduct = async (req, res) => {
    const { 
        name,
        description,
        image,
        costPrice,
        salePrice,
        category,
        ingredients
    } = req.body;

    // Validar campos obligatorios
    const requiredFields = ['name', 'image', 'costPrice', 'salePrice', 'category'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        });
    }

    try {
        // Validar formato de ID de categoría
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ 
                message: 'Formato de ID de categoría inválido' 
            });
        }

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
        const categoriaValida = await Category.findOne({
            _id: category,
            restaurantId: req.user.restaurant
        });

        if (!categoriaValida) {
            return res.status(400).json({ 
                message: 'Categoría no existe o no pertenece a tu restaurante' 
            });
        }

        // Crear nuevo producto
        const nuevoProducto = await productRepository.createProduct({
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

        res.status(201).json({
            _id: nuevoProducto._id,
            nombre: nuevoProducto.name,
            precio: nuevoProducto.salePrice,
            categoria: nuevoProducto.category,
            disponible: nuevoProducto.available
        });

    } catch (error) {
        console.error('Error al crear producto:', error);
        const mensaje = error.name === 'ValidationError' 
            ? 'Datos del producto inválidos: ' + error.message
            : 'Error interno del servidor';
        res.status(500).json({ message: mensaje });
    }
};

////////////////////////////////////////////////////////////
//                     READ SECTION                      ///
////////////////////////////////////////////////////////////

// Función para obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await productRepository.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener un producto por ID
const getProductById = async (req, res) => {
    try {
        const product = await productRepository.getProductById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        // Verificar que el producto pertenezca al restaurante del usuario
        if (product.restaurantId.toString() !== req.user.restaurant) {
            return res.status(403).json({ message: 'No tienes permiso para ver este producto' });
        }
        
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nueva función para obtener productos por ID del restaurante
const getProductsByRestaurantId = async (req, res) => {
    try {
        if (req.user.restaurant === 'Empty') {
            return res.status(400).json({ message: 'Primero debes crear un restaurante' });
        }
        
        const products = await productRepository.getProductsByRestaurantId(req.user.restaurant);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

////////////////////////////////////////////////////////////
//                     UPDATE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para actualizar un producto
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productRepository.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

////////////////////////////////////////////////////////////
//                     DELETE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productRepository.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByRestaurantId,
    updateProduct,
    deleteProduct,
};
