////////////////////////////////////////////////////////////
//                     Kiosk Router                      ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const kioskController = require('./kioskController'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

// Rutas para kioskos
router.post('/', authMiddleware.verifyTokenMiddleware, kioskController.createKiosk);
router.get('/mine', authMiddleware.verifyTokenMiddleware, kioskController.getKiosksByRestaurantId);
router.post('/login/kiosk', kioskController.loginKiosk); // Iniciar sesión como kiosko (sin verifyToken)

module.exports = router;
