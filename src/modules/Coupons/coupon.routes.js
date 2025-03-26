import express from 'express';
import couponController from './coupon.controller.js';
import authMiddleware from '../Auth/auth.middleware.js';

const router = express.Router();

/**
 * @description Ruta para crear un nuevo cupón
 */
router.post('/myCoupon', authMiddleware.verifyTokenMiddleware, couponController.createCoupon);

/**
 * @description Ruta para obtener todos los cupones de un restaurante
 */
router.get('/restaurant/:restaurantId', authMiddleware.verifyTokenMiddleware, couponController.getCouponsByRestaurant);

/**
 * @description Ruta para obtener un cupón específico por ID
 */
router.get('/myCoupon/:id', authMiddleware.verifyTokenMiddleware, couponController.getCouponById);

/**
 * @description Ruta para obtener un cupón por su código
 */
router.get('/myCoupon/code/:code', authMiddleware.verifyTokenMiddleware, couponController.getCouponByCode);

/**
 * @description Ruta para actualizar un cupón por ID
 */
router.put('/:id', authMiddleware.verifyTokenMiddleware, couponController.updateCouponById);

/**
 * @description Ruta para eliminar un cupón por ID
 */
router.delete('/:id', authMiddleware.verifyTokenMiddleware, couponController.deleteCouponById);

/**
 * @description Ruta para calcular el descuento de un cupón
 */
router.post('/myCoupon/discount/:code', authMiddleware.verifyTokenMiddleware, couponController.calculateCouponDiscount);

export default router; 