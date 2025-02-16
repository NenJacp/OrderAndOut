const express = require('express');
const router = express.Router();
const { logout } = require('./authController');

router.post('/logout', logout);

module.exports = router; 