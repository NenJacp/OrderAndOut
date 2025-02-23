////////////////////////////////////////////////////////////
//                     Order Model                         ///
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    numOrder: { type: String, required: true }, // Asegúrate de que sea único y requerido
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Referencia al modelo Product
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in preparation', 'completed', 'waiting for payment'], // Estados permitidos
        default: 'pending', // Estado por defecto
    },
    notes: { // Campo opcional para notas
        type: String,
        default: '', // Valor por defecto es una cadena vacía
    },
    createdById: { // ID de quien creó la orden (kiosko, cajero o usuario)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdByType: { // Tipo de usuario que creó la orden
        type: String,
        enum: ['customer', 'admin', 'cashier', 'kiosk'], // Tipos de usuario permitidos
        required: true, // Este campo es requerido
    },
    restaurantId: { // ID del restaurante al que pertenece la orden
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Referencia al modelo Restaurant
        required: true,
    },
    paymentMethod: { // Método de pago
        type: String,
        enum: ['card', 'cash'], // Métodos de pago permitidos
        required: true,
    },
    paymentStatus: { // Estado de pago
        type: String,
        enum: ['pending', 'paid', 'failed'], // Estados de pago permitidos
        default: 'pending', // Estado por defecto
    },
    currency: {
        type: String,
        default: 'MXN',
        required: true,
    },
},
{
    timestamps: true,
}
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;