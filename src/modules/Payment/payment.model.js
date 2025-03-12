import mongoose from 'mongoose'; // Importar mongoose

/**
 * @description Definición del esquema de Pago
 */
const paymentSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: true, // Monto total a cobrar
    },
    pago: {
        type: Number,
        required: true, // Monto recibido
    },
    cambio: {
        type: Number,
        required: true, // Monto de cambio a devolver
    },
    method: {
        type: String,
        enum: ['stripe', 'efectivo'], // Métodos de pago permitidos
        required: true,
    },
    currency: {
        type: String,
        required: true, // Moneda del pago
        default: 'MXN'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true, // Agregar timestamps automáticamente
});

/**
 * @description Exportación del modelo de Pago
 */
const Payment = mongoose.model('Payment', paymentSchema);
export default Payment; 