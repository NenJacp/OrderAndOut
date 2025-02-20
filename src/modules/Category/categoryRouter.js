const express = require('express');
const router = express.Router();
const { createCategory, getMyCategories } = require('./categoryController');
const verifyToken = require('../Auth/authMiddleware');
const { updateCategory } = require('./categoryRepository');

router.post('/', verifyToken, createCategory);
router.get('/mine', verifyToken, getMyCategories);
router.put('/', verifyToken, updateCategoryJWT);

module.exports = router; 