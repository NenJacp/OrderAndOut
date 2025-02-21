////////////////////////////////////////////////////////////
//                     Product Router                     ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const productController = require('./productController'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Ruta para productos del restaurante actual
router.get('/mine', authMiddleware.verifyTokenMiddleware, productController.getProductsByRestaurantId);

// Rutas para operaciones con ID específico
router.get('/:productId', authMiddleware.verifyTokenMiddleware, productController.getProductById);
router.put('/:productId', authMiddleware.verifyTokenMiddleware, productController.updateProduct);
router.delete('/:productId', authMiddleware.verifyTokenMiddleware, productController.deleteProduct);

// Ruta para crear productos
router.post('/', authMiddleware.verifyTokenMiddleware, productController.createProduct);

// Nueva ruta para productos disponibles
router.get('/available', authMiddleware.verifyTokenMiddleware, (req, res) => {
    productController.getProductsByRestaurantId(req, res);
});

module.exports = router;
