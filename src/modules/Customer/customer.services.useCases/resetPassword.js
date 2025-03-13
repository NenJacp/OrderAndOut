import Customer from './../customer.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const resetPassword = async (email) => {
    const customer = await Customer.findOne({ email });

    if (!customer) {
        throw new Error('Cliente no encontrado.');
    }

    // Generar un código de restablecimiento
    const resetPasswordCode = crypto.randomBytes(3).toString('hex');
    customer.resetPasswordCode = resetPasswordCode;
    customer.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora

    await customer.save();
    return resetPasswordCode; // Retornar el código para enviar por correo
};

const updatePassword = async (email, resetPasswordCode, newPassword) => {
    const customer = await Customer.findOne({ email });

    if (!customer || customer.resetPasswordCode !== resetPasswordCode || customer.resetPasswordExpires < Date.now()) {
        throw new Error('Código de restablecimiento inválido o expirado.');
    }

    const saltRounds = 10;
    customer.password = await bcrypt.hash(newPassword, saltRounds);
    customer.resetPasswordCode = null; // Limpiar el código de restablecimiento
    customer.resetPasswordExpires = null; // Limpiar la fecha de expiración

    await customer.save();
    return customer;
};

export { resetPassword, updatePassword }; 