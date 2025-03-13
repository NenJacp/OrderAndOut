import Customer from './../../customer.model.js';
import AuthService from './../../../Auth/auth.service.js'; // Importar el servicio de autenticación

const createCustomer = async (customerData) => {
    // Validar que se reciban todos los campos requeridos
    const { firstName, lastName, birthdate, email, password, address } = customerData;

    if (!firstName || !lastName || !birthdate || 
        !email || !password || 
        !address || !address.street || !address.number || 
        !address.colony || !address.city || !address.zip) {
        throw new Error('Faltan campos obligatorios en los datos del cliente.');
    }

    // Encriptar la contraseña utilizando el servicio de autenticación
    const hashedPassword = await AuthService.hasher(password);

    // Generar un código de verificación utilizando el servicio de autenticación
    const verificationCode = AuthService.generateAdminCode(); // Genera un código aleatorio

    // Crear un nuevo cliente con los datos proporcionados
    const customer = new Customer({
        firstName,
        lastName,
        birthdate,
        email,
        password: hashedPassword,
        phone: customerData.phone || '',
        image: customerData.image || '',
        address: {
            street: address.street,
            number: address.number,
            letter: address.letter || '',
            colony: address.colony,
            city: address.city,
            state: address.state || 'Yucatán',
            zip: address.zip,
            country: address.country || 'México',
        },
        card: customerData.card || null,
        latitude: null,
        longitude: null,
        isVerified: false, // Por defecto, no verificado
        verificationCode, // Código de verificación
        resetPasswordCode: null, // Inicialmente nulo
        resetPasswordExpires: null, // Inicialmente nulo
    });

    // Guardar el nuevo cliente en la base de datos
    await customer.save();
    return customer;
};

export default createCustomer; 