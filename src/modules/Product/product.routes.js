const express = require('express');
const router = express.Router();

const productController = require('./product.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

//ADMIN ROUTES
router.post('/myProduct', authMiddleware.verifyTokenMiddleware, productController.createProduct);
router.put('/myProduct/:productId', authMiddleware.verifyTokenMiddleware, productController.updateProductById_CurrentAdmin);
router.delete('/myProduct/:productId', authMiddleware.verifyTokenMiddleware, productController.deleteProductById_CurrentAdmin);

//KIOSK - ADMIN ROUTES
router.get('/myProduct/:productId', authMiddleware.verifyTokenMiddleware, productController.getProductById_CurrentUser);
router.get('/mineProducts', authMiddleware.verifyTokenMiddleware, productController.getProductsByRestaurant_CurrentUser);


//DEVELOPER ROUTES
router.get('/', authMiddleware.verifyTokenMiddleware, productController.getAllProducts);
router.get('/:productId', authMiddleware.verifyTokenMiddleware, productController.getProductsById);
router.put('/:productId', authMiddleware.verifyTokenMiddleware, productController.updateProductById);
router.delete('/:productId', authMiddleware.verifyTokenMiddleware, productController.deleteProductById);

module.exports = router;
