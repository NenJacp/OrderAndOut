const express = require('express'); // Importar express
const router = express.Router(); // Crear un enrutador

const kioskController = require('./kiosk.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware


//KIOSKO ROUTES


/**
 * @description Ruta para iniciar sesión en un kiosko
 */
router.post('/login/myKiosk', kioskController.loginKiosk);

/**
 * @description Ruta para cerrar sesión en un kiosko
 */
router.post('/logout/myKiosk', authMiddleware.verifyTokenMiddleware, kioskController.logoutKiosk);

/**
 * @description Ruta para obtener un kiosko por JWT
 */
router.get('/me', authMiddleware.verifyTokenMiddleware, kioskController.getCurrentKiosk); //Para probar el token


//ADMIN ROUTES


/**
 * @description Ruta para crear un nuevo kiosko
 */
router.post('/myKiosk', authMiddleware.verifyTokenMiddleware, kioskController.createKiosk);

/**
 * @description Ruta para obtener todos los kioskos de un restaurante por JWT
 */
router.get('/mineKiosks', authMiddleware.verifyTokenMiddleware, kioskController.getKiosks_CurrentAdmin);

/**
 * @description Ruta para obtener un kiosko por ID
 */
router.get('/myKiosk/:kioskId', authMiddleware.verifyTokenMiddleware, kioskController.getKioskById);

/**
 * @description Ruta para actualizar un kiosko por Id del kiosko
 */
router.put('/myKiosk/:kioskId', authMiddleware.verifyTokenMiddleware, kioskController.updateKioskById);


/**
 * @description Ruta para eliminar un kiosko por Id del kiosko
 */
router.delete('/myKiosk/:kioskId', authMiddleware.verifyTokenMiddleware, kioskController.deleteKioskById);


//DEVELOPER ROUTES


/**
 * @description Ruta para obtener todos los kioskos
 */
router.get('/', authMiddleware.verifyTokenMiddleware, kioskController.getAllKiosks);

/**
 * @description Ruta para obtener todos los kioskos de un restaurante por ID
 */
router.get('/:restaurantId', authMiddleware.verifyTokenMiddleware, kioskController.getKiosksByRestaurantById);

/**
 * @description Ruta para obtener un kiosko por ID
 */
router.get('/:kioskId', authMiddleware.verifyTokenMiddleware, kioskController.getKioskById);

/**
 * @description Ruta para actualizar un kiosko por ID
 */
router.put('/:kioskId', authMiddleware.verifyTokenMiddleware, kioskController.updateKioskById);

/**
 * @description Ruta para eliminar un kiosko por ID
 */
router.delete('/:kioskId', authMiddleware.verifyTokenMiddleware, kioskController.deleteKioskById);

module.exports = router;
