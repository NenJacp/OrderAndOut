import Customer from './../../Customer/customer.model.js';

const verifyCustomer = async (email, verificationCode) => {
    const customer = await Customer.findOne({ email });

    if (!customer) {
        throw new Error('Cliente no encontrado.');
    }

    if (customer.verificationCode !== verificationCode) {
        throw new Error('Código de verificación incorrecto.');
    }

    customer.isVerified = true;
    customer.verificationCode = null; // Limpiar el código de verificación
    await customer.save();

    return customer;
};

export default verifyCustomer; 