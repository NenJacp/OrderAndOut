const restaurantRepository = require('./restaurantRepository'); // Importar el repositorio
const adminRepository = require('../Admin/adminRepository');  // Cambiar modelo por repositorio
const categoryRepository = require('../Category/categoryRepository');  // Cambiar modelo por repositorio
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken para generar tokens

// Función para crear un nuevo restaurante
const createRestaurant = async (req, res) => {
    const { name, image, location} = req.body;
    const adminId = req.user.id; // obtencion del id del admin por el token

    // Validar que el admin tenga permiso
    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'Solo administradores pueden crear restaurantes' });
    }

    // Validar campos requeridos
    if (!name || !image || !location?.country || !location?.city || !location?.address || !location?.postalCode) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Verificar si el admin ya tiene restaurante
        const admin = await adminRepository.getAdminById(adminId);
        if (admin.restaurant) {
            return res.status(400).json({ message: 'Ya tienes un restaurante registrado' });
        }

        // Crear nuevo restaurante
        const newRestaurant = await restaurantRepository.createRestaurant({name, image, location, adminId});

        // Corregir la actualización del admin (faltaba asignar a variable)
        const updatedAdmin = await adminRepository.updateAdmin(
            adminId, 
            { restaurant: newRestaurant._id }
        );

        if (!updatedAdmin) {
            await restaurantRepository.deleteRestaurant(newRestaurant._id);
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        // Generar nuevo token con los datos actualizados
        const token = jwt.sign(
            {
                id: updatedAdmin._id,
                type: 'admin',
                restaurant: newRestaurant._id // ← Usar el ID del nuevo restaurante
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({ token });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear el restaurante' });
    }
}

// Función para obtener todos los restaurantes
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantRepository.getAllRestaurants();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los restaurantes' });
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
        
        // Nuevo: Populate de categorías del restaurante
        const categories = await categoryRepository.getCategoriesByRestaurant(restaurant._id);
        const restaurantWithCategories = { ...restaurant._doc, categories };
        
        res.status(200).json(restaurantWithCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el restaurante' });
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