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
    const { name, description, image, price, availability, creationTime, ingredients, category } = req.body; // Desestructuración de datos
    const restaurantId = req.params.restaurantId; // Obtener el ID del restaurante de los parámetros

    if (!name || !description || !image || !price || !creationTime || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' }); // Validación de campos
    }

    try {
        const newProduct = await productRepository.createProduct({
            name,
            description,
            image,
            price,
            availability,
            creationTime,
            restaurantId, // Usar el ID del restaurante desde los parámetros
            ingredients,
            category,
        });

        res.status(201).json(newProduct); // Responder con el nuevo producto
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
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
        const product = await productRepository.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Nueva función para obtener productos por ID del restaurante
const getProductsByRestaurantId = async (req, res) => {
    const restaurantId = req.params.restaurantId; // Obtener el ID del restaurante desde el token
    try {
        const products = await productRepository.getProductsByRestaurantId(restaurantId);
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para este restaurante.' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
