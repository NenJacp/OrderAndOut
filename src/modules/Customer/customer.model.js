import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        letter: {
            type: String,
            default: '',
        },
        colony: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            default: 'Yucatán',
        },
        zip: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            default: 'México',
        },
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        default: null,
        required: false,
    },
    latitude: {
        type: Number,
        required: false,
    },
    longitude: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;



