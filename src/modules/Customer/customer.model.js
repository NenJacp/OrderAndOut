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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
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
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        index: true,
    },
    codeExpires: {
        type: Date,
        default: null
    },
    resetPasswordCode: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;



