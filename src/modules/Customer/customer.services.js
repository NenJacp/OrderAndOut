import createCustomer from './customer.services.useCases/GET/createCustomer.js';

class CustomerService {
    static async createCustomer(customerData) {
        return await createCustomer(customerData);
    }
}

export default CustomerService; 