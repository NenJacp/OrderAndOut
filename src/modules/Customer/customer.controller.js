import CustomerService from './customer.services.js';
import verifyCustomer from './customer.services.useCases/verifyCustomer.js';
import { resetPassword, updatePassword } from './customer.services.useCases/resetPassword.js';

class CustomerController {
    static async createCustomer(req, res) {
        try {
            const customerData = req.body;
            const newCustomer = await CustomerService.createCustomer(customerData);
            return res.status(201).json(newCustomer);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async verifyCustomer(req, res) {
        try {
            const { email, verificationCode } = req.body;
            const customer = await verifyCustomer(email, verificationCode);
            return res.status(200).json({ message: 'Cliente verificado con éxito', customer });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const resetCode = await resetPassword(email);
            // Aquí deberías enviar el código por correo electrónico
            return res.status(200).json({ message: 'Código de restablecimiento enviado', resetCode });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email, resetPasswordCode, newPassword } = req.body;
            const customer = await updatePassword(email, resetPasswordCode, newPassword);
            return res.status(200).json({ message: 'Contraseña actualizada con éxito', customer });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export default CustomerController; 