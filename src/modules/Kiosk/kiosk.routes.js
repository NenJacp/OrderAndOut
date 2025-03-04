import express from 'express'; // Importación de express
const router = express.Router(); // Creación de un enrutador

import kioskController from './kiosk.controller.js'; // Importar el controlador
import authMiddleware from '../Auth/auth.middleware.js'; // Importar el middleware


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

//DEVELOPER ROUTES


/**
 * @description Ruta para obtener todos los kioskos
 */
router.get('/', authMiddleware.verifyTokenMiddleware, kioskController.getAllKiosks);

export default router;
