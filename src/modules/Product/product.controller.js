const productService = require('./product.service'); // Importar el repositorio
const authService = require('../Auth/auth.service'); // Importar funciones de hashing
const categoryService = require('../Category/category.service'); // Importar el modelo de categoría

////////////////////////////////////////////////////////////
//                     CREATE SECTION                    ///
////////////////////////////////////////////////////////////

// Función para crear un nuevo producto
const createProductByJWT = async (req, res) => {
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
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener un producto por ID
const getProductById_JWT = async (req, res) => {
    try {
        // Corregir la desestructuración
        const { productId } = req.body;
        
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

        res.status(200).json(product);
    } catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({ 
            message: 'Error al obtener producto',
            error: error.message
        });
    }
};

// Nueva función para obtener productos por ID del restaurante
const getProductsByRestaurantId = async (req, res) => {
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

////////////////////////////////////////////////////////////
//                     UPDATE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para actualizar un producto
const updateProductById_JWT = async (req, res) => {
    try {
        // Corregir la desestructuración
        const { productId, ...productData } = req.body; // ← Usar rest operator

        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para actualizar productos' });
        }

        // Validar campos requeridos
        if (!productId) {
            return res.status(400).json({ message: 'Se requiere ID del producto' });
        }

        const currentProduct = await productService.getProductById(productId);

        console.log(currentProduct.restaurantId);
        console.log(req.user.restaurant);

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

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar',
            error: error.message
        });
    }
};

////////////////////////////////////////////////////////////
//                     DELETE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para eliminar un producto
const deleteProductById_JWT = async (req, res) => {

    const { productId } = req.body;

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

module.exports = {
    createProductByJWT,
    getAllProducts,
    getProductById_JWT,
    getProductsByRestaurantId,
    updateProductById_JWT,
    deleteProductById_JWT,
};
