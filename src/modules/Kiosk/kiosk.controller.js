import authService from '../Auth/auth.service.js'; // Importar funciones de comparación y hashing
import kioskService from './kiosk.service.js'; // Importar el servicio de kiosko

// KIOSKO CONTROLLERS


/**
 * @description Iniciar sesión en el kiosko
 * @param {object} req
 * @param {object} res
 */
const loginKiosk = async (req, res) => {

    /**
     * @description Obtener el serial y la contraseña del kiosko
     * @const {string} serial
     * @const {string} password
     */
    const { serial , password } = req.body;

    /**
     * @description Verificar si el ID y la contraseña son requeridos
     */
    if (!serial || !password) {
        return res.status(400).json({ message: 'Serial y contraseña requeridos' });
    }
    /**
     * @description Obtener el kiosko por serial
     */
    try {

        /**
         * @description Obtener el kiosko por serial
         * @param {string} serial
         * @const {object} kiosk
         */
        const kiosk = await kioskService.getKioskById(serial);

        /**
         * @description Verificar si el kiosko existe
         */
        if (!kiosk) {
            return res.status(404).json({ message: 'Kiosko no encontrado' });
        }

        /**
         * @description Verificar si la contraseña es válida
         * @param {string} password
         * @param {string} kiosk.password
         * @const {boolean} isPasswordValid
         */
        const isPasswordValid = await authService.comparer(password, kiosk.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        /**
         * @description Verificar si el kiosko está deshabilitado
         */

        if (kiosk.status !== 'activo') {
            return res.status(403).json({ message: 'Kiosko deshabilitado' });
        }
        /**
         * @description Obtener la duración del token
         * @const {string} tokenDuration
         */
        const tokenDuration = kiosk.tokenDuration === 'none' ? undefined : kiosk.tokenDuration;

        /**
         * @description Verificar si ya está conectado (reconexión permitida)
         */
        if (kiosk.isConnected) {

            /**
             * @description Generar un token de autenticación
             * @param {string} kiosk._id
             * @param {string} kiosk
             * @param {string} kiosk.restaurantId._id
             * @param {string} kiosk.name
             * @const {string} token
             */
            const token = authService.generateKioscoAuthToken({
                id: kiosk._id.toString(),
                type: 'kiosk',
                restaurant: kiosk.restaurantId._id.toString(),
                name: kiosk.name
            }, tokenDuration);
            /**
             * @description Devolver el token de autenticación
             * @response {string} token
             */
            return res.status(200).json({ 
                token
            });
        }

        /**
         * @description Actualizar el estado de conexión
         * @param {string} kiosk._id
         * @param {boolean} true
         * @param {Date} new Date()
         * @param {Date} null
         */
        await kioskService.updateKioskById(kiosk._id, {
            isConnected: true,
            connected_at: new Date(),
            disconnected_at: null
        });
        /**
         * @description Generar un token de autenticación
         * @param {string} kiosk._id
         * @param {string} 'kiosk'
         * @param {string} kiosk.restaurantId._id
         * @param {string} kiosk.name
         * @param {string} tokenDuration
         * @const {string} token
         */
        const token = authService.generateKioscoAuthToken(
            {
                id: kiosk._id.toString(),
                type: 'kiosk',
                restaurant: kiosk.restaurantId._id.toString(),
                name: kiosk.name
            }, 
            tokenDuration
        );
        /**
         * @description Devolver el token de autenticación
         * @response {string} token
         */
        res.status(200).json({ token });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

/**
 * @description Desconectar un kiosko
 * @param {object} req
 * @param {object} res
 */
const logoutKiosk = async (req, res) => {

    /**
     * @description Desconectar un kiosko
     */
    try {
        
        /**
         * @description Desconectar un kiosko
         * @param {string} req.user.id
         * @param {boolean} false
         * @param {Date} new Date()
         */
        await kioskService.updateKioskById(req.user.id, {
            isConnected: false,
            disconnected_at: new Date().toISOString()
        });

        /**
         * @description Devolver el mensaje de desconexión
         * @response {string} message
         */
        res.status(200).json({ message: 'Desconectado exitosamente' });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al desconectar el kiosko' });
    }
};

/**
 * @description Obtener el kiosko por JWT
 * @param {object} req
 * @param {object} res
 */
const getCurrentKiosk = async (req, res) => {

    if(req.user.type !== 'kiosk') {
        return res.status(403).json({ message: 'El usuario actual no es un kiosko' });
    }

    /**
     * @description Obtener el kiosko por JWT
     */
    try {

        /**
         * @description Obtener el kiosko por JWT
         */
        const kiosk = await kioskService.getKioskById(req.user.id);

        /**
         * @description Devolver el kiosko
         * @response {object} kiosk
         */
        res.status(200).json(kiosk);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener el kiosko' });
    }
};


//ADMIN CONTROLLERS


/**
 * @description Crear un nuevo kiosko
 * @param {object} req
 * @param {object} res
 */
const createKiosk = async (req, res) => {

    /**
     * @description Obtener la contraseña del kiosko
     * @const {string} password
     */
    const { name, password, description } = req.body;
    /**
     * @description Verificar si el usuario es administrador
     */
    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para crear un kiosko, solo los administradores pueden hacerlo' });
    }
    /**
     * @description Verificar si el usuario tiene un restaurante asignado
     */
    if (!req.user?.restaurant) {
        return res.status(400).json({ message: 'Restaurante no asignado' });
    }
    /**
     * @description Crear un nuevo kiosko
     */
    try {
        
        /**
         * @description Hashear la contraseña
         * @param {string} password
         * @const {string} hashedPassword
         */
        const hashedPassword = await authService.hasher(password);
        /**
         * @description Crear un nuevo kiosko
         * @param {string} password
         * @param {string} restaurantId
         * @const {object} newKiosk
         */
        const newKiosk = await kioskService.createKiosk({
            name,
            password: hashedPassword,
            description,
            restaurantId: req.user.restaurant
        });
        /**
         * @description Devolver el kiosko creado
         * @response {object} newKiosk
         */
        res.status(201).json({ message: 'Kiosko creado exitosamente', kiosk: newKiosk });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al crear el kiosko' });
    }
};

/**
 * @description Obtener todos los kioskos por ID del restaurante
 * @param {object} req
 * @param {object} res
 */
const getKiosks_CurrentAdmin = async (req, res) => {

    /**
     * @description Obtener todos los kioskos por ID del restaurante
     */
    try {

        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para obtener los kioskos, solo los administradores pueden hacerlo' });
        }
        /**
         * @description Obtener todos los kioskos por ID del restaurante
         */
        const kiosks = await kioskService.getKiosksByRestaurantId(req.user.restaurant);

        /**
         * @description Devolver los kioskos
         * @response {object} kiosks
         */
        res.status(200).json(kiosks);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener los kioskos' });
    }
};

const getKioskById_CurrentAdmin = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para obtener el kiosko, solo los administradores pueden hacerlo' });
    }

    try {

        const kioskId = req.params.kioskId;
        /**
         * @description Obtener el kiosko por ID
         */
        const kiosk = await kioskService.getKioskById(kioskId);

        /**
         * @description Devolver el kiosko
         * @response {object} kiosk
         */
        res.status(200).json(kiosk);

    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener el kiosko' });
    }
}

/**
 * @description Actualizar el kiosko por JWT
 * @param {object} req
 * @param {object} res
 */
const updateKioskById_CurrentAdmin = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para actualizar el kiosko, solo los administradores pueden hacerlo' });
    }

    /**
     * @description Actualizar el kiosko por JWT
     */
    try {

        const kioskId = req.params.kioskId;

        if (req.body.password) {
            req.body.password = await authService.hasher(req.body.password);
        }

        /**
         * @description Actualizar el kiosko por JWT
         */
        const kiosk = await kioskService.updateKioskById(kioskId, req.body);

        /**
         * @description Devolver el kiosko actualizado
         * @response {object} kiosk
         */
        res.status(200).json(kiosk);

    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al actualizar el kiosko' });
    }
};

/**
 * @description Eliminar el kiosko por JWT
 * @param {object} req
 * @param {object} res
 */
const deleteKioskById_CurrentAdmin = async (req, res) => {

    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para eliminar el kiosko, solo los administradores pueden hacerlo' });
    }

    try {
        // Corregir la extracción del ID
        const  kioskId  = req.params.kioskId;
        
        const deletedKiosk = await kioskService.deleteKioskById(kioskId);
        
        if (!deletedKiosk) {
            return res.status(404).json({ message: 'Kiosko no encontrado' });
        }
        res.status(200).json({ message: 'Kiosko eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el kiosko' });
    }
};


//DEVELOPER CONTROLLERS

/**
 * @description Obtener todos los kioskos
 * @param {object} req
 * @param {object} res
 */
const getAllKiosks = async (req, res) => {


    try {
        /**
         * @description Obtener todos los kioskos
         */
        const kiosks = await kioskService.getAllKiosks();

        /**
         * @description Devolver los kioskos
         * @response {object} kiosks
         */
        res.status(200).json(kiosks);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener los kioskos' });
    }
}; 

/**
 * @description Exportar las funciones del controlador
 */
export default {

    //KIOSKO CONTROLLERS

    getCurrentKiosk,
    loginKiosk,
    logoutKiosk,

    //ADMIN CONTROLLERS

    createKiosk,
    getKiosks_CurrentAdmin,
    getKioskById_CurrentAdmin,
    updateKioskById_CurrentAdmin,
    deleteKioskById_CurrentAdmin,

    //DEVELOPER CONTROLLERS

    getAllKiosks
};