const adminService = require('../Admin/admin.service'); 
const authService = require('../Auth/auth.service'); 
const categoryService = require('../Category/category.service'); 
const restaurantService = require('./restaurant.service'); 

//ADMIN CONTROLLERS

/**
 * @description Crear un nuevo restaurante por JWT del administrador actual
 */
const createRestaurant_CurrentAdmin = async (req, res) => {
    try {

        //Extraer los datos del body de la solicitud, ...rest es para campos que no son requeridos y que pueden ser opcionales en la creacion del restaurante
        const { name, image, location, ...rest } = req.body;

        //Si el usuario no es administrador, no puede crear un restaurante
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: 'Solo administradores sin restaurante pueden crear nuevos restaurantes' });
        }

        //Si el administrador ya tiene un restaurante, no puede crear otro
        if ( req.user.restaurant !== null) {
            return res.status(403).json({ message: 'Solo puedes tener un restaurante por cuenta' });
        }

        //Si alguno de los campos requeridos no esta presente, devolver un error 400
        if (!name || !image || !location?.country || !location?.city || !location?.address?.street || !location?.address?.number || !location?.address?.crossStreets || !location?.address?.colony || !location?.address?.references || !location?.postalCode) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });            
        }

        /**
         * @description Crear un nuevo restaurante con los datos del body
         * @const {Object} newRestaurant - Nuevo restaurante creado
         */
        const newRestaurant = await restaurantService.createRestaurantById({name, image, location, adminId: req.user._id, ...rest});

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

        //Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al crear el restaurante' });
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

    //Si el usuario no es desarrollador, no puede obtener los restaurantes
    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para obtener los restaurantes, solo los desarrolladores pueden hacerlo' });
    }

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

const getRestaurantById = async (req, res) => {
    const { restaurantId } = req.params.restaurantId; 

    //Si el usuario no es desarrollador, no puede obtener el restaurante
    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para obtener el restaurante, solo los desarrolladores pueden hacerlo' });
    }

    //Intentar obtener el restaurante
    try {

        //Obtener el restaurante
        const restaurant = await restaurantService.getRestaurantById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        
        /**
         * @description Obtener las categorias del restaurante
         * @const {Object} categories - Categorias del restaurante
         */
        const categories = await categoryService.getCategoriesByRestaurant(restaurant._id);

        /**
         * @description Obtener el restaurante con las categorias
         * @const {Object} restaurantWithCategories - Restaurante con las categorias
         */
        const restaurantWithCategories = { ...restaurant._doc, categories };

        //Devolver el restaurante con las categorias
        res.status(200).json(restaurantWithCategories);
    } catch (error) {

        //Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al obtener el restaurante' });
    }
};

/**
 * @description Actualizar un restaurante por ID
 */
const updateRestaurantById = async (req, res) => {

    //Si el usuario no es desarrollador, no puede actualizar el restaurante
    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para actualizar el restaurante, solo los desarrolladores pueden hacerlo' });
    }

    //Intentar actualizar el restaurante
    try {
        const updatedRestaurant = await restaurantService.updateRestaurantById(req.params.restaurantId, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el restaurante' });
    }
}

const deleteRestaurantById = async (req, res) => {

    //Si el usuario no es desarrollador, no puede eliminar el restaurante
    if (req.user.type !== 'developer') {
        return res.status(403).json({ message: 'No tienes permisos para eliminar el restaurante, solo los desarrolladores pueden hacerlo' });
    }

    //Intentar eliminar el restaurante  
    try {

        //Eliminar el restaurante
        const deletedRestaurant = await restaurantService.deleteRestaurantById(req.params.restaurantId);

        //Si el restaurante no se encuentra, devolver un error 404
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        //Devolver un mensaje de confirmacion
        res.status(204).send({ message: 'Restaurante eliminado correctamente' });
    } catch (error) {

        //Si ocurre un error, devolver un error 500
        res.status(500).json({ message: 'Error al eliminar el restaurante' });
    }
}

module.exports = {

    //ADMIN CONTROLLERS

    createRestaurant_CurrentAdmin,
    getRestaurant_CurrentAdmin,
    updateRestaurant_CurrentAdmin,
    deleteRestaurant_CurrentAdmin,

    //DEVELOPER CONTROLLERS

    getAllRestaurants,
    getRestaurantById,
    updateRestaurantById,
    deleteRestaurantById,
};