////////////////////////////////////////////////////////////
//                     Kiosk Router                      ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const kioskController = require('./kioskController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware

// Rutas para kioskos
router.post('/', verifyToken, kioskController.createKiosk);
router.get('/mine', verifyToken, kioskController.getKiosksByRestaurantId);
router.post('/login/kiosk', kioskController.loginKiosk); // Iniciar sesión como kiosko (sin verifyToken)
router.put('/', verifyToken, kioskController.updateKiosk);

module.exports = router;
