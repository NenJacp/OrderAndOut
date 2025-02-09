////////////////////////////////////////////////////////////
//                     Restaurant Controller                ///
////////////////////////////////////////////////////////////

const restaurantRepository = require('./restaurantRepository'); // Importar el repositorio
const Admin = require('../Admin/adminModel'); // Importar modelo Admin

////////////////////////////////////////////////////////////
//                     CREATE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para crear un nuevo restaurante
const createRestaurant = async (req, res) => {
    const { name, image, location, delivery, categories, hours } = req.body; // Obtener otros campos del cuerpo de la solicitud
    const adminId = req.user.id; // Obtener ID del admin desde el token

    if (!name || !image || !location || !hours) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Verificar si el admin ya tiene restaurante
        const admin = await Admin.findById(adminId);
        if (admin.restaurant) {
            return res.status(400).json({ message: 'Ya tienes un restaurante registrado' });
        }

        // Crear nuevo restaurante
        const newRestaurant = await restaurantRepository.createRestaurant({
            name,
            image,
            location,
            delivery,
            categories,
            hours,
            adminId: adminId // Registrar relación con el admin
        });

        // Actualizar admin con el nuevo restaurante
        await Admin.findByIdAndUpdate(adminId, { 
            restaurant: newRestaurant._id 
        });

        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

////////////////////////////////////////////////////////////
//                     READ SECTION                        ///
////////////////////////////////////////////////////////////

// Función para obtener todos los restaurantes
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantRepository.getAllRestaurants();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener un restaurante por ID
const getRestaurantById = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros

    try {
        const restaurant = await restaurantRepository.getRestaurantById(id); // Buscar restaurante por ID
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener restaurantes por ID de administrador
const getRestaurantsByAdminId = async (req, res) => {
    console.log("hola");
    const { adminId } = req.params; // Obtener el ID del administrador desde los parámetros

    try {
        const restaurants = await restaurantRepository.getRestaurantsByAdminId(adminId); // Buscar restaurantes por adminId
        if (!restaurants || restaurants.length === 0) {
            return res.status(404).json({ message: 'No se encontraron restaurantes para este administrador' });
        }
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

////////////////////////////////////////////////////////////
//                     UPDATE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para actualizar un restaurante
const updateRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await restaurantRepository.updateRestaurant(req.params.id, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

////////////////////////////////////////////////////////////
//                     DELETE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para eliminar un restaurante
const deleteRestaurant = async (req, res) => {
    try {
        const deletedRestaurant = await restaurantRepository.deleteRestaurant(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

////////////////////////////////////////////////////////////
//                     GET SECTION                        ///
////////////////////////////////////////////////////////////

const getRestaurantByAdmin = async (req, res) => {
    try {
        const restaurant = await restaurantRepository.getRestaurantByAdminId(req.user.id);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByAdminId,
    getRestaurantByAdmin,
};