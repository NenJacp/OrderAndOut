import CustomerService from './customer.services.js';

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
}

export default CustomerController; 