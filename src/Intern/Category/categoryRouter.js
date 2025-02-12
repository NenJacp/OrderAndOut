const express = require('express');
const router = express.Router();
const { createCategory, getMyCategories } = require('./categoryController');
const verifyToken = require('../Auth/authMiddleware');

router.post('/', verifyToken, createCategory);
router.get('/mine', verifyToken, getMyCategories);

module.exports = router; 