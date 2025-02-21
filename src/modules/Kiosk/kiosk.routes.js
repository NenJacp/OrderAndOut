const express = require('express'); // Importar express
const router = express.Router(); // Crear un enrutador

const kioskController = require('./kiosk.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

//////////////////////////////////////////////////////////////////////////////////
//                 █ █ ▄▀▀ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀                    //
//                 ▀▄█ ▄██ █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██                    //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta para crear un nuevo kiosko
 */
router.post('/myKiosk', authMiddleware.verifyTokenMiddleware, kioskController.createKioskByJWT);

/**
 * @description Ruta para iniciar sesión en un kiosko
 */
router.post('/login/kiosk', kioskController.loginKiosk);

/**
 * @description Ruta para cerrar sesión en un kiosko
 */
router.post('/logout', authMiddleware.verifyTokenMiddleware, kioskController.logoutKiosk);

/**
 * @description Ruta para obtener un kiosko por JWT
 */
router.get('/mykiosk', authMiddleware.verifyTokenMiddleware, kioskController.getKioskByJWT);

/**
 * @description Ruta para eliminar un kiosko por JWT
 */
router.delete('/mykiosk', authMiddleware.verifyTokenMiddleware, kioskController.deleteKioskByJWT);

/**
 * @description Ruta para obtener todos los kioskos de un restaurante por JWT
 */
router.get('/restaurant/myKiosk', authMiddleware.verifyTokenMiddleware, kioskController.getKiosksByRestaurantByJWT);

//////////////////////////////////////////////////////////////////////////////////
//          █▀▄ ██▀ █ █ ██▀ █   ▄▀▄ █▀▄ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀       //
//          █▄▀ █▄▄ ▀▄▀ █▄▄ █▄▄ ▀▄▀ █▀  █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██       //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta para obtener todos los kioskos
 */
router.get('/', authMiddleware.verifyDeveloperToken, kioskController.getAllKiosks);

/**
 * @description Ruta para obtener un kiosko por ID
 */
router.get('/:id', authMiddleware.verifyDeveloperToken, kioskController.getKioskById);

/**
 * @description Ruta para actualizar un kiosko por ID
 */
router.put('/:id', authMiddleware.verifyDeveloperToken, kioskController.updateKioskById);

/**
 * @description Ruta para eliminar un kiosko por ID
 */
router.delete('/:id', authMiddleware.verifyDeveloperToken, kioskController.deleteKioskById);

/**
 * @description Ruta para obtener todos los kioskos de un restaurante por ID
 */
router.get('/restaurant/:restaurantId', authMiddleware.verifyDeveloperToken, kioskController.getKiosksByRestaurantById);

module.exports = router;
