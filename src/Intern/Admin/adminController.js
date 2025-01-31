////////////////////////////////////////////////////////////
//                     Admin Controller                  ///
////////////////////////////////////////////////////////////

const adminRepository = require('./adminRepository'); // Importar el repositorio
const { hasher, comparer } = require('../Auth/authService');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
require('dotenv').config(); // Cargar variables de entorno

////////////////////////////////////////////////////////////
//                     CREATE SECTION                    ///
////////////////////////////////////////////////////////////

// Ejemplo de función para crear un nuevo administrador
const createAdmin = async (req, res) => {
    const { firstName, lastNamePaternal, lastNameMaternal, birthDate, email, password } = req.body; // Desestructuración de datos

    if (!firstName || !lastNamePaternal || !lastNameMaternal || !birthDate || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' }); // Validación de campos
    }

    // Validar el correo electrónico antes de hashearlo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: `${email} no es un correo válido!` }); // Validación de correo
    }

    try {
        const hashedPassword = await hasher(password); // Hasear la contraseña
        const newAdmin = await adminRepository.createAdmin({ // Llamar al repositorio para crear el administrador
            firstName,
            lastNamePaternal,
            lastNameMaternal,
            birthDate,
            email, // Guardar el correo sin hashear
            password: hashedPassword
        });

        res.status(201).json(newAdmin); // Responder con el nuevo administrador
    } catch (error) {
        if (error.code === 11000) { // Código de error para duplicados
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
}

////////////////////////////////////////////////////////////
//                     LOGIN SECTION                       ///
////////////////////////////////////////////////////////////

// Función para iniciar sesión como administrador
const loginAdmin = async (req, res) => {
    const { email, password } = req.body; // Desestructuración de datos

    // Verificar que se proporcionen ambos campos
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios.' }); // Validación de campos
    }

    try {
        const admin = await adminRepository.getAdminByEmail(email); // Obtener el administrador por email
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado.' }); // Manejo de no encontrado
        }

        const isPasswordValid = await comparer(password, admin.password); // Comparar la contraseña
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' }); // Manejo de contraseña incorrecta
        }

        // Generar un token JWT con solo el ID y tipo
        const token = jwt.sign({ id: admin._id, type: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' }); // Agregar tipo de usuario
        res.status(200).json({ token, adminId: admin._id }); // Responder con el token y el ID del administrador
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
}

////////////////////////////////////////////////////////////
//                     READ SECTION                      ///
////////////////////////////////////////////////////////////

// Ejemplo de función para obtener todos los administradores
const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminRepository.getAllAdmins(); // Llamar al repositorio para obtener todos los administradores
        res.status(200).json(admins); // Responder con la lista de administradores
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

// Ejemplo de función para obtener un administrador por ID
const getAdminById = async (req, res) => {
    try {
        const admin = await adminRepository.getAdminById(req.params.id); // Llamar al repositorio para buscar administrador por ID
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' }); // Manejo de no encontrado
        }
        res.status(200).json(admin); // Responder con el administrador encontrado
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
}

////////////////////////////////////////////////////////////
//                     UPDATE SECTION                    ///
////////////////////////////////////////////////////////////

// Ejemplo de función para actualizar los detalles de un administrador
const updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await adminRepository.updateAdmin(req.params.id, req.body); // Llamar al repositorio para actualizar administrador
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Administrador no encontrado' }); // Manejo de no encontrado
        }
        res.status(200).json(updatedAdmin); // Responder con el administrador actualizado
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
}

////////////////////////////////////////////////////////////
//                     DELETE SECTION                    ///
////////////////////////////////////////////////////////////

// Ejemplo de función para eliminar un administrador
const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await adminRepository.deleteAdmin(req.params.id); // Llamar al repositorio para eliminar administrador
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Administrador no encontrado' }); // Manejo de no encontrado
        }
        res.status(204).send(); // Sin contenido
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
}

module.exports = {
    createAdmin,
    loginAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
