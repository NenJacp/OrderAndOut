import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    cardHolderName: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya números de tarjeta duplicados
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 4, // CVV puede ser de 3 o 4 dígitos
    },
    cardType: {
        type: String,
        enum: ['debito', 'credito'], // Tipos de tarjeta permitidos
        required: true,
    },
    billingAddress: {
        type: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        required: true,
    },
}, {
    timestamps: true
});

const Card = mongoose.model('Card', cardSchema);
export default Card;