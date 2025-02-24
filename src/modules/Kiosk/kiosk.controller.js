const kioskService = require('./kiosk.service'); // Importar el servicio
const authService = require('../Auth/auth.service'); // Importar funciones de comparación y hashing
const deviceService = require('../Device/device.service'); // Importar el servicio de dispositivo

//////////////////////////////////////////////////////////////////////////////////////////
//              █ █ ▄▀▀ ██▀ █▀▄   ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █   █   ██▀ █▀▄ ▄▀▀          //
//              ▀▄█ ▄██ █▄▄ █▀▄   ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄ █▄▄ █▄▄ █▀▄ ▄██          // 
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Crear un nuevo kiosko
 * @param {object} req
 * @param {object} res
 */
const createKioskByJWT = async (req, res) => {

    /**
     * @description Obtener la contraseña del kiosko
     * @const {string} password
     */
    const { name, password } = req.body;
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
        console.log("try");
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
        const newKiosk = await kioskService.createKioskById({
            name,
            password: hashedPassword,
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
    console.log("serial", serial);
    /**
     * @description Verificar si el ID y la contraseña son requeridos
     */
    if (!serial || !password) {
        console.log("no tiene serial o password");
        return res.status(400).json({ message: 'Serial y contraseña requeridos' });
    }
    console.log("tiene serial y password");
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
         * @description Verificar si el kiosko está deshabilitado
         */
        if (kiosk.status !== 'active') {
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
             * @param {string} 'kiosk'
             * @param {string} kiosk.restaurantId._id
             * @const {string} token
             */
            const token = authService.generateKioscoAuthToken({
                id: kiosk._id.toString(),
                type: 'kiosk',
                restaurant: kiosk.restaurantId._id.toString()
            }, tokenDuration);
            /**
             * @description Devolver el token de autenticación
             * @response {string} token
             */
            return res.status(200).json({ 
                message: 'Reconexión exitosa',
                token,
                kioskId: kiosk._id,
                restaurantId: kiosk.restaurantId._id
            });
        }

        /**
         * @description Verificar límite de conexiones
         * @param {string} kiosk.restaurantId._id
         * @param {boolean} isConnected
         * @const {number} connectedKiosks
         */
        const connectedKiosks = await kioskService.countDocuments({ 
            restaurantId: kiosk.restaurantId._id,
            isConnected: true
        });
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
         * @param {string} tokenDuration
         * @const {string} token
         */
        const token = authService.generateKioscoAuthToken(
            {
                id: kiosk._id.toString(),
                type: 'kiosk',
                restaurant: kiosk.restaurantId._id.toString()
            }, 
            tokenDuration
        );
        /**
         * @description Devolver el token de autenticación
         * @response {string} token
         */
        res.status(200).json({ 
            token,
            kioskId: kiosk._id,
            restaurantId: kiosk.restaurantId._id
        });
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
            disconnected_at: new Date()
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
const getKioskByJWT = async (req, res) => {

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

/**
 * @description Obtener todos los kioskos por ID del restaurante
 * @param {object} req
 * @param {object} res
 */
const getKiosksByRestaurantByJWT = async (req, res) => {

    /**
     * @description Obtener todos los kioskos por ID del restaurante
     */
    try {

        console.log("req.user.restaurant", req.user.restaurant);
        /**
         * @description Obtener todos los kioskos por ID del restaurante
         */
        const kiosks = await kioskService.getKiosksByRestaurantId(req.user.restaurant);

        console.log("kiosks", kiosks);
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
 * @description Actualizar el kiosko por JWT
 * @param {object} req
 * @param {object} res
 */
const updateKioskById_JWT = async (req, res) => {

    /**
     * @description Actualizar el kiosko por JWT
     */
    try {

        /**
         * @description Actualizar el kiosko por JWT
         */
        const kiosk = await kioskService.updateKioskById(req.user.id, req.body);

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
const deleteKioskById_JWT = async (req, res) => {

    /**
     * @description Eliminar el kiosko por JWT
     */
    try {

        /**
         * @description Eliminar el kiosko por JWT
         * @param {string} req.user.id
         * @const {<Promise>object} deletedKiosk
         */
        const deletedKiosk = await kioskService.deleteKioskById(req.user.id);

        /**
         * @description Verificar si el kiosko existe
         */
        if (!deletedKiosk) {
            return res.status(404).json({ message: 'Kiosko no encontrado' });
        }
        /**
         * @description Devolver el kiosko eliminado
         * @response {object} kiosk
         */
        res.status(200).json({ message: 'Kiosko eliminado correctamente' });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al eliminar el kiosko' });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////
//  █▀▄ ██▀ █ █ ██▀ █   ▄▀▄ █▀▄ ██▀ █▀▄   ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █   █   ██▀ █▀▄ ▄▀▀  //
//  █▄▀ █▄▄ ▀▄▀ █▄▄ █▄▄ ▀▄▀ █▀  █▄▄ █▀▄   ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄ █▄▄ █▄▄ █▀▄ ▄██  //
//////////////////////////////////////////////////////////////////////////////////////////

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
 * @description Obtener el kiosko por ID
 * @param {object} req
 * @param {object} res
 */
const getKioskById = async (req, res) => {

    /**
     * @description Obtener el kiosko por ID
     */
    try {

        /**
         * @description Obtener el kiosko por ID
         */
        const kiosk = await kioskService.getKioskById(req.params.id);

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


const getKiosksByRestaurantById = async (req, res) => {

    /**
     * @description Obtener el ID del restaurante
     * @param {string} req.params.restaurantId
     */
    const restaurantId = req.params;

    /**
     * @description Obtener todos los kioskos por ID del restaurante
     */
    try {

        /**
         * @description Obtener todos los kioskos por ID del restaurante
         */
        const kiosks = await kioskService.getKiosksByRestaurantId(restaurantId);

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

const updateKioskById = async (req, res) => {

    /**
     * @description Actualizar el kiosko por ID
     */
    try {

        /**
         * @description Actualizar el kiosko por ID
         */
        const kiosk = await kioskService.updateKioskById(req.params.id, req.body);

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

const deleteKioskById = async (req, res) => {

    /**
     * @description Eliminar el kiosko por ID
     */
    try {

        /**
         * @description Eliminar el kiosko por ID
         * @param {string} req.params.id
         * @const {<Promise>object} deletedKiosk
         */
        const deletedKiosk = await kioskService.deleteKioskById(req.params.id);

        /**
         * @description Verificar si el kiosko existe
         */
        if (!deletedKiosk) {
            return res.status(404).json({ message: 'Kiosko no encontrado' });
        }

        /**
         * @description Devolver el kiosko eliminado
         * @response {object} kiosk
         */
        res.status(200).json({ message: 'Kiosko eliminado correctamente' });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al eliminar el kiosko' });
    }
};



/**
 * @description Exportar las funciones del controlador
 */
module.exports = {
    getAllKiosks,
    getKioskById,
    getKioskByJWT,
    getKiosksByRestaurantByJWT,
    getKiosksByRestaurantById,
    updateKioskById,
    deleteKioskById,
    updateKioskById_JWT,
    deleteKioskById_JWT,
    createKioskByJWT,
    loginKiosk,
    logoutKiosk
};