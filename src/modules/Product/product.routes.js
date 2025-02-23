////////////////////////////////////////////////////////////
//                     Product Router                     ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const productController = require('./product.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Ruta para productos del restaurante actual
router.get('/mineProducts', authMiddleware.verifyTokenMiddleware, productController.getProductsByRestaurantId);
router.post('/myProduct', authMiddleware.verifyTokenMiddleware, productController.createProductByJWT);

// Rutas para operaciones con ID específico
router.get('/myProduct/', authMiddleware.verifyTokenMiddleware, productController.getProductById_JWT);
router.put('/myProduct/', authMiddleware.verifyTokenMiddleware, productController.updateProductById_JWT);
router.delete('/myProduct/', authMiddleware.verifyTokenMiddleware, productController.deleteProductById_JWT);

// Nueva ruta para productos disponibles
router.get('/available', authMiddleware.verifyTokenMiddleware, (req, res) => {
    productController.getProductsByRestaurantId(req, res);
});

module.exports = router;
