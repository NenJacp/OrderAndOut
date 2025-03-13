import Customer from './../../customer.model.js';

const createCustomer = async (customerData) => {
    // Validar que se reciban todos los campos requeridos
    const { firstName, lastName, birthdate, address } = customerData;

    if (!firstName || !lastName || !birthdate || 
        !address || !address.street || !address.number || 
        !address.colony || !address.city || !address.zip) {
        throw new Error('Faltan campos obligatorios en los datos del cliente.');
    }

    // Crear un nuevo cliente con los datos proporcionados
    const customer = new Customer({
        firstName,
        lastName,
        birthdate,
        image: customerData.image || '', // Campo opcional
        address: {
            street: address.street,
            number: address.number,
            letter: address.letter || '', // Campo opcional
            colony: address.colony,
            city: address.city,
            state: address.state || 'Yucatán', // Valor por defecto
            zip: address.zip,
            country: address.country || 'México', // Valor por defecto
        },
        card: customerData.card || null, // ID de la tarjeta asociada (opcional)
        latitude: null, // Se establece como null ya que no se obtienen coordenadas
        longitude: null, // Se establece como null ya que no se obtienen coordenadas
    });

    // Guardar el nuevo cliente en la base de datos
    await customer.save();
    return customer;
};

export default createCustomer; 