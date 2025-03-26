import mongoose from 'mongoose';

// Definición del esquema del cupón
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true // Asegura que cada código de cupón sea único
    },
    status: {
        type: String,
        enum: ['valid', 'expired', 'consumed', 'disabled'], // Enumera los posibles estados del cupón
        default: 'valid' // Estado predeterminado del cupón
    },
    validity: {
        type: Date,
        required: true // Fecha de validez del cupón
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Referencia al modelo de Restaurante
        required: true // ID del restaurante asociado al cupón
    },
    discount: {
        type: Number,
        required: true // Descuento ofrecido por el cupón
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'], // Tipo de descuento: porcentaje o fijo
        required: true
    },
    description: {
        type: String, // Campo para descripción del cupón
        required: false // No es obligatorio
    }
}, 
{ 
    timestamps: true // Incluye timestamps para el cupón
});

// Creación del modelo de Cupón
const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon; 