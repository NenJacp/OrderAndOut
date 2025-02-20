////////////////////////////////////////////////////////////
//                     Product Router                     ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const productController = require('./productController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Ruta para productos del restaurante actual
router.get('/mine', verifyToken, productController.getProductsByRestaurantId);

// Rutas para operaciones con ID específico
router.get('/:productId', verifyToken, productController.getProductById);
router.put('/', verifyToken, productController.updateProduct);
router.delete('/:productId', verifyToken, productController.deleteProduct);

// Ruta para crear productos
router.post('/', verifyToken, productController.createProduct);

// Nueva ruta para productos disponibles
router.get('/available', verifyToken, (req, res) => {
    productController.getProductsByRestaurantId(req, res);
});

module.exports = router;
