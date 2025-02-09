////////////////////////////////////////////////////////////
//                     Product Controller                ///
////////////////////////////////////////////////////////////

const productRepository = require('./productRepository'); // Importar el repositorio
const { hasher } = require('../Auth/authService'); // Importar funciones de hashing

////////////////////////////////////////////////////////////
//                     CREATE SECTION                    ///
////////////////////////////////////////////////////////////

// Función para crear un nuevo producto
const createProduct = async (req, res) => {
    const { name, description, price, image, category, available } = req.body;
    
    if (!name || !price || !category) {
        return res.status(400).json({ message: 'Nombre, precio y categoría son requeridos' });
    }

    try {
        // Verificar si el admin tiene restaurante
        if (req.user.restaurant === 'Empty') {
            return res.status(400).json({ message: 'Debes tener un restaurante registrado' });
        }

        const newProduct = await productRepository.createProduct({
            name,
            description,
            price,
            image: image || 'https://ejemplo.com/default.jpg',
            category,
            available: available !== undefined ? available : true,
            restaurantId: req.user.restaurant // Añadir desde el token
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
