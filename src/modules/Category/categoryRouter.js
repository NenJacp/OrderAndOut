const express = require('express');
const router = express.Router();
const categoryController = require('./categoryController');
const authMiddleware = require('../Auth/auth.middleware');

router.post('/', authMiddleware.verifyTokenMiddleware, categoryController.createCategory);
router.get('/mine', authMiddleware.verifyTokenMiddleware, categoryController.getMyCategories);

module.exports = router; 