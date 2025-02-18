////////////////////////////////////////////////////////////
//                     Product Router                     ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const productController = require('./productController'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Ruta para productos del restaurante actual
router.get('/mine', authMiddleware.verifyToken, productController.getProductsByRestaurantId);

// Rutas para operaciones con ID específico
router.get('/:productId', authMiddleware.verifyToken, productController.getProductById);
router.put('/:productId', authMiddleware.verifyToken, productController.updateProduct);
router.delete('/:productId', authMiddleware.verifyToken, productController.deleteProduct);

// Ruta para crear productos
router.post('/', authMiddleware.verifyToken, productController.createProduct);

// Nueva ruta para productos disponibles
router.get('/available', authMiddleware.verifyToken, (req, res) => {
    productController.getProductsByRestaurantId(req, res);
});

module.exports = router;
