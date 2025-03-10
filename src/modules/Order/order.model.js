import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    numOrder: {
        type: String,
        required: true,
    },
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
            costPrice: {
                type: Number,
                require: true
            },
            salePrice: {
                type: Number,
                require: true
            }
        },
    ],
    totalCost: {
        type: Number,
        required: true
    },
    totalSale: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pendiente', // Estado por defecto
    enum: ['pendiente', 'cancelado', 'finalizado', 'preparando'],
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
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment', // Referencia al modelo Payment
        required: false,
    },
    paymentMethod: {
        type: String,
        require: true,
        enum: ["efectivo", "tarjeta"]
    },
    currency: {
        type: String,
        default: 'MXN',
    },
    orderType: { // Nuevo campo agregado
        type: String,
        default: 'llevar', // Valor por defecto
    }
},
{
    timestamps: true,
}
);

const Order = mongoose.model('Order', orderSchema);
export default Order;