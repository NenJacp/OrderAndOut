import adminService from '../Admin/admin.service.js'; 
import authService from '../Auth/auth.service.js'; 
import restaurantService from './restaurant.service.js'; 

//ADMIN CONTROLLERS

/**
 * @description Crear un nuevo restaurante por JWT del administrador actual
 */
const createRestaurant_CurrentAdmin = async (req, res) => {
    try {
        const restaurantData = req.body; // Obtener los datos del restaurante del cuerpo de la solicitud

        //Si el usuario no es administrador, no puede crear un restaurante
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: 'Solo administradores sin restaurante pueden crear nuevos restaurantes' });
        }

        //Si el administrador ya tiene un restaurante, no puede crear otro
        if ( req.user.restaurant !== null) {
            return res.status(403).json({ message: 'Solo puedes tener un restaurante por cuenta' });
        }

        //Si alguno de los campos requeridos no esta presente, devolver un error 400
        if (!restaurantData.name || !restaurantData.image || !restaurantData.location?.country || !restaurantData.location?.city || !restaurantData.location?.address?.street || !restaurantData.location?.address?.number || !restaurantData.location?.address?.crossStreets || !restaurantData.location?.address?.colony || !restaurantData.location?.address?.references || !restaurantData.location?.postalCode) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });            
        }

        restaurantData.adminId = req.user.id;

        /**
         * @description Crear un nuevo restaurante con los datos del body
         * @const {Object} newRestaurant - Nuevo restaurante creado
         */
        const newRestaurant = await restaurantService.createRestaurant(restaurantData);
        
        /**
         * @description Actualizar el administrador con el id del nuevo restaurante
         * @const {Object} updatedAdmin - Administrador actualizado
         */
        const updatedAdmin = await adminService.updateAdminById(req.user.id, { restaurant: newRestaurant._id });
        
        //Si el administrador no se encuentra, eliminar el restaurante y devolver un error 404
        if (!updatedAdmin) {
            await restaurantService.deleteRestaurantById(newRestaurant._id);            
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        //Generar un token de autenticacion para el administrador
        const token = authService.generateAdminAuthToken
        ({
            id: updatedAdmin._id,
            type: 'admin',
            restaurant: newRestaurant._id
        });    

        //Devolver el token y el restaurante creado
        res.status(201).json({ token, restaurant: newRestaurant });

    } catch (error) {
        console.error('Error al crear el restaurante:', error.message); // Registrar el error
        res.status(500).json({ message: 'Error al crear el restaurante', error: error.message }); // Devolver un mensaje de error
    }
}

/**
 * @description Obtener el restaurante del administrador actual
 */
const getRestaurant_CurrentAdmin = async (req, res) => {

    //Si el usuario no es administrador, no puede obtener el restaurante
    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para obtener el restaurante, solo los administradores pueden hacerlo' });
    }

    //Intentar obtener el restaurante del administrador actual
    try {

        /**
         * @description Obtener el restaurante del administrador actual
         * @const {Object} adminRestaurant - Restaurante del administrador actual
         */
        const restaurantId = req.user.restaurant;
        
        /**
         * @description Obtener el restaurante del administrador actual
         * @const {Object} restaurant - Restaurante del administrador actual
         */
        const restaurant = await restaurantService.getRestaurantById(restaurantId);
        
        //Si el restaurante no se encuentra, devolver un error 404
        if (!restaurant) {
            return res.status(404).json({ 
                message: 'Restaurante no encontrado',
                debugInfo: `ID buscado: ${restaurantId || 'undefined'}`
            });
        }
        
        //Devolver el restaurante del administrador actual
        res.status(200).json(restaurant);

    } catch (error) {

        //Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al obtener el restaurante', error: error.message });
    }
};

/**
 * @description Actualizar el restaurante del administrador actual por JWT
 */
const updateRestaurant_CurrentAdmin = async (req, res) => {

    //Si el usuario no es administrador, no puede actualizar el restaurante
    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para actualizar el restaurante, solo los administradores pueden hacerlo' });
    }

    //Intentar actualizar el restaurante del administrador actual   
    try {

        //Actualizar el restaurante del administrador actual
        const updatedRestaurant = await restaurantService.updateRestaurantById(req.user.restaurant, req.body);

        //Si el restaurante no se encuentra, devolver un error 404
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        //Devolver el restaurante actualizado
        res.status(200).json(updatedRestaurant);
    } catch (error) {

        //Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al actualizar el restaurante' });
    }
}

/**
 * @description Eliminar el restaurante del administrador actual por JWT
 */
const deleteRestaurant_CurrentAdmin = async (req, res) => {

    //Si el usuario no es administrador, no puede eliminar el restaurante
    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para eliminar el restaurante, solo los administradores pueden hacerlo' });
    }

    //Intentar eliminar el restaurante del administrador actual
    try {

        //Eliminar el restaurante del administrador actual
        const deletedRestaurant = await restaurantService.deleteRestaurantById(req.user.restaurant);
        
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        //Actualizar el administrador con el restaurante eliminado
        const updatedAdmin = await adminService.updateAdminById(req.user.id, { restaurant: null });

        //Devolver un mensaje de confirmacion
        res.status(204).send({ message: 'Restaurante eliminado correctamente' });
    } catch (error) {

        //Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al eliminar el restaurante' });
    }
}

//DEVELOPER CONTROLLERS

/**
 * @description Obtener todos los restaurantes
 */ 
const getAllRestaurants = async (req, res) => {

    

    //Intentar obtener todos los restaurantes   
    try {

        //Obtener los restaurantes
        const { page = 1, limit = 10 } = req.query;
        const restaurants = await restaurantService.getAllRestaurants(page, limit);

        //Devolver los restaurantes
        res.status(200).json(restaurants);
    } catch (error) {

        //Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al obtener los restaurantes' });
    }
};

/**
 * @description Obtener solo el nombre del restaurante del usuario actual
 */
const getRestaurantName_CurrentUser = async (req, res) => {
    try {
        // Obtener el ID del restaurante del usuario autenticado
        const restaurantId = req.user.restaurant;
        
        if (!restaurantId) {
            return res.status(404).json({ 
                message: 'No tienes un restaurante asignado'
            });
        }
        
        // Obtener el restaurante por ID
        const restaurant = await restaurantService.getRestaurantById(restaurantId);
        
        // Si el restaurante no se encuentra, devolver un error 404
        if (!restaurant) {
            return res.status(404).json({ 
                message: 'Restaurante no encontrado'
            });
        }
        
        // Devolver solo el nombre del restaurante
        res.status(200).json({ 
            restaurantName: restaurant.name 
        });
    } catch (error) {
        // Si ocurre un error, devolver un error 500
        res.status(500).json({ 
            message: 'Error al obtener el nombre del restaurante', 
            error: error.message 
        });
    }
};

export default {
    //ADMIN CONTROLLERS

    createRestaurant_CurrentAdmin,
    getRestaurant_CurrentAdmin,
    updateRestaurant_CurrentAdmin,
    deleteRestaurant_CurrentAdmin,

    //DEVELOPER CONTROLLERS

    getAllRestaurants,

    // NUEVO CONTROLADOR
    getRestaurantName_CurrentUser
};