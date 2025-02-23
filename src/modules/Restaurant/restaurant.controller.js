const adminService = require('../Admin/admin.service'); 
const authService = require('../Auth/auth.service'); 
const categoryService = require('../Category/category.service'); 
const restaurantService = require('./restaurant.service'); 

//////////////////////////////////////////////////////////////////////////////////////////
//              █ █ ▄▀▀ ██▀ █▀▄   ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █   █   ██▀ █▀▄ ▄▀▀          //
//              ▀▄█ ▄██ █▄▄ █▀▄   ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄ █▄▄ █▄▄ █▀▄ ▄██          // 
//////////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createRestaurantByJWT = async (req, res) => {

    /**
     * @description Intentar crear un nuevo restaurante
     */
    try {
       
        /**
         * @description Obtener los datos necesarios para crear un nuevo restaurante y ...rest son los datos que no son necesarios o requeridos
         * @param {string} name
         * @param {string} image
         * @param {object} location
         * @param {object} rest
         */
        const { name, image, location, ...rest } = req.body;

        /**
         * @description Obtener el id del administrador por el token
         * @const {string} adminId
         * @const {object} adminRestaurant
         * @const {string} adminType
         */
        const { id: adminId, type: adminType, restaurant: adminRestaurant } = req.user;

        /**
         * @description Verificar si el usuario es administrador y no tiene restaurante
         */
        if (adminType !== 'admin') {
            return res.status(403).json({ message: 'Solo administradores sin restaurante pueden crear nuevos restaurantes' });
        }

        /**
         * @description Verificar si el administrador ya tiene un restaurante
         */
        if ( adminRestaurant !== null) {
            return res.status(403).json({ message: 'Solo puedes tener un restaurante por cuenta' });
        }

        /**
         * @description Verificar si los campos requeridos son correctos
         */
        if (!name || !image || !location?.country || !location?.city || !location?.address?.street || !location?.address?.number || !location?.address?.crossStreets || !location?.address?.colony || !location?.address?.references || !location?.postalCode) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });            
        }

        /**
         * @description Crear nuevo restaurante
         * @param {string} name
         * @param {string} image
         * @param {object} location
         * @param {string} adminId
         * @param {object} ...rest
         * @const {<Promise>object} newRestaurant
         */
        const newRestaurant = await restaurantService.createRestaurantById({name, image, location, adminId, ...rest});

        /**
         * @description Corregir la actualización del admin (faltaba asignar a variable)
         * @param {string} adminId
         * @param {<Promise>object} updatedAdmin
         */
        const updatedAdmin = await adminService.updateAdminById(adminId, { restaurant: newRestaurant._id });

        /**
         * @description Si el administrador no se actualiza, eliminar el restaurante
         * @param {string} newRestaurant._id
         * @const {string} updatedAdmin
         */
        if (!updatedAdmin) {
            await restaurantService.deleteRestaurantById(newRestaurant._id);            
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        /**
         * @description Generar nuevo token con los datos actualizados
         * @param {string} updatedAdmin._id
         * @param {string} 'admin'
         * @param {string} newRestaurant._id
         * @const {string} token
         */
        const token = authService.generateAdminAuthToken
        ({
            id: updatedAdmin._id,
            type: 'admin',
            restaurant: newRestaurant._id // ← Usar el ID del nuevo restaurante
        });    

        /**
         * @description Devolver el token
         * @response {string} token
         */
        res.status(201).json({ token, restaurant: newRestaurant });

    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al crear el restaurante' });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getRestaurantByJWT = async (req, res) => {

    /**
     * @description Intentar obtener el restaurante por JWT
     */
    try {

        /**
         * @description Obtener el restaurante por JWT
         * @const {string} adminRestaurant
         */
        const { restaurant: adminRestaurant } = req.user;
        
        /**
         * @description Obtener el restaurante por ID
         * @param {string} adminRestaurant
         * @const {<Promise>object} restaurant
         */
        const restaurant = await restaurantService.getRestaurantById(adminRestaurant);
        
        /**
         * @description Si el restaurante no existe, devolver un error
         */
        if (!restaurant) {
            return res.status(404).json({ 
                message: 'Restaurante no encontrado',
                debugInfo: `ID buscado: ${adminRestaurant || 'undefined'}`
            });
        }
        
        /**
         * @description Devolver el restaurante
         * @response {object} restaurant
         */
        res.status(200).json(restaurant);

    } catch (error) {
        
        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener el restaurante', error: error.message });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateRestaurantByJWT = async (req, res) => {
    
    /**
     * @description Intentar actualizar el restaurante por JWT
     */
    try {
        /**
         * @description Actualizar el restaurante por JWT
         * @param {string} req.user.restaurant
         * @param {object} req.body
         * @const {<Promise>object} updatedRestaurant
         */
        const updatedRestaurant = await restaurantService.updateRestaurantByJWT(req.user.restaurant, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        /**
         * @description Devolver el restaurante actualizado
         * @response {object} updatedRestaurant
         */
        res.status(200).json(updatedRestaurant);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al actualizar el restaurante' });
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteRestaurantByJWT = async (req, res) => {

    /**
     * @description Intentar eliminar el restaurante por JWT
     */
    try {

        /**
         * @description Eliminar el restaurante por JWT
         * @param {string} req.user.restaurant
         * @const {<Promise>object} deletedRestaurant
         */
        const deletedRestaurant = await restaurantService.deleteRestaurantById(req.user.restaurant);
        
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        /**
         * @description Devolver el restaurante eliminado
         * @response {object} deletedRestaurant
         */
        res.status(204).send({ message: 'Restaurante eliminado correctamente' });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al eliminar el restaurante' });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////
//  █▀▄ ██▀ █ █ ██▀ █   ▄▀▄ █▀▄ ██▀ █▀▄   ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █   █   ██▀ █▀▄ ▄▀▀  //
//  █▄▀ █▄▄ ▀▄▀ █▄▄ █▄▄ ▀▄▀ █▀  █▄▄ █▀▄   ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄ █▄▄ █▄▄ █▀▄ ▄██  //
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getAllRestaurants = async (req, res) => {

    /**
     * @description Intentar obtener todos los restaurantes con paginación
     */
    try {

        /**
         * @description Obtener los parámetros de paginación
         * @const {number} page
         * @const {number} limit
         */
        const { page = 1, limit = 10 } = req.query;

        /**
         * @description Obtener todos los restaurantes con paginación
         * @param {number} page
         * @param {number} limit
         * @const {<Promise>object} restaurants
         */
        const restaurants = await restaurantService.getAllRestaurants(page, limit);

        /**
         * @description Devolver los restaurantes con paginación
         * @response {object} restaurants
         */
        res.status(200).json(restaurants);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener los restaurantes' });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getRestaurantById = async (req, res) => {

    /**
     * @description Obtener el ID del restaurante
     * @const {string} restaurantId
     */
    const { restaurantId } = req.params; 

    /**
     * @description Intentar obtener el restaurante por ID
     */
    try {

        /**
         * @description Obtener el restaurante por ID
         * @param {string} restaurantId
         * @const {<Promise>object} restaurant
         */
        const restaurant = await restaurantService.getRestaurantById(restaurantId); // Buscar restaurante por ID
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        
        /**
         * @description Obtener las categorías del restaurante
         * @param {string} restaurant._id
         * @const {<Promise>object} categories
         */
        const categories = await categoryService.getCategoriesByRestaurant(restaurant._id);

        /**
         * @description Devolver el restaurante con las categorías
         * @response {object} restaurantWithCategories
         */
        const restaurantWithCategories = { ...restaurant._doc, categories };

        /**
         * @description Devolver el restaurante con las categorías
         * @response {object} restaurantWithCategories
         */
        res.status(200).json(restaurantWithCategories);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener el restaurante' });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateRestaurantById = async (req, res) => {

    /**
     * @description Intentar actualizar el restaurante por ID
     */
    try {

        /**
         * @description Actualizar el restaurante por ID
         * @param {string} req.params.id
         * @param {object} req.body
         * @const {<Promise>object} updatedRestaurant
         */
        const updatedRestaurant = await restaurantService.updateRestaurantById(req.params.id, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        /**
         * @description Devolver el restaurante actualizado
         * @response {object} updatedRestaurant
         */
        res.status(200).json(updatedRestaurant);
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al actualizar el restaurante' });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteRestaurantById = async (req, res) => {

    /**
     * @description Intentar eliminar el restaurante por ID
     */
    try {

        /**
         * @description Eliminar el restaurante por ID
         * @param {string} req.params.id
         * @const {<Promise>object} deletedRestaurant
         */
        const deletedRestaurant = await restaurantService.deleteRestaurantById(req.params.id);

        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        /**
         * @description Devolver el restaurante eliminado
         * @response {object} deletedRestaurant
         */
        res.status(204).send({ message: 'Restaurante eliminado correctamente' });
    } catch (error) {

        /**
         * @description Devolver el error
         * @response {string} error.message
         */
        res.status(500).json({ message: 'Error al eliminar el restaurante' });
    }
}

module.exports = {
    createRestaurantByJWT,
    getAllRestaurants,
    getRestaurantById,
    getRestaurantByJWT,
    updateRestaurantById,
    updateRestaurantByJWT,
    deleteRestaurantById,
    deleteRestaurantByJWT
};