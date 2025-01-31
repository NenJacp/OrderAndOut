////////////////////////////////////////////////////////////
//                     Product Router                     ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const productController = require('./productController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para productos
router.post('/:restaurantId', verifyToken, productController.createProduct); // Crear un nuevo producto con ID de restaurante
router.get('/', productController.getAllProducts); // Obtener todos los productos
router.get('/:id', productController.getProductById); // Obtener un producto por ID
router.get('/restaurant/:restaurantId', productController.getProductsByRestaurantId); // Obtener productos por ID del restaurante
router.put('/:id', verifyToken, productController.updateProduct); // Actualizar un producto
router.delete('/:id', verifyToken, productController.deleteProduct); // Eliminar un producto

module.exports = router;
