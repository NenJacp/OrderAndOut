////////////////////////////////////////////////////////////
//                     Kiosk Router                      ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const kioskController = require('./kioskController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para kioskos
router.post('/:restaurantId', verifyToken, kioskController.createKiosk); // Obtener restaurantId de los parámetros
router.get('/restaurant/:restaurantId', verifyToken, kioskController.getKiosksByRestaurantId); // Obtener kioskos por ID del restaurante
router.post('/login', kioskController.loginKiosk); // Iniciar sesión como kiosko (sin verifyToken)

module.exports = router;
