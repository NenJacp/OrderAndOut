import express from 'express';
const router = express.Router();

import productController from './product.controller.js'; // Importar el controlador
import authMiddleware from '../Auth/auth.middleware.js'; // Importar el middleware

//ADMIN ROUTES
router.post('/myProduct', authMiddleware.verifyTokenMiddleware, productController.createProduct);
router.put('/myProduct/:productId', authMiddleware.verifyTokenMiddleware, productController.updateProductById_CurrentAdmin);
router.delete('/myProduct/:productId', authMiddleware.verifyTokenMiddleware, productController.deleteProductById_CurrentAdmin);

//KIOSK - ADMIN ROUTES
router.get('/myProduct/:productId', authMiddleware.verifyTokenMiddleware, productController.getProductById_CurrentUser);
router.get('/mineProducts', authMiddleware.verifyTokenMiddleware, productController.getProductsByRestaurant_CurrentUser);
router.get('/products/category/:categoryId', authMiddleware.verifyTokenMiddleware, productController.getProductsByCategory_CurrentUser);

//DEVELOPER ROUTES
router.get('/', authMiddleware.verifyTokenMiddleware, productController.getAllProducts);

export default router;
