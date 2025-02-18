const express = require('express');
const router = express.Router();
const categoryController = require('./categoryController');
const authMiddleware = require('../Auth/auth.middleware');

router.post('/', authMiddleware.verifyToken, categoryController.createCategory);
router.get('/mine', authMiddleware.verifyToken, categoryController.getMyCategories);

module.exports = router; 