const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    location: {
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        address: {
            street: { type: String, required: true },
            number: { type: String, required: true },
            crossStreets: { type: String, required: true },
            colony: { type: String, required: true },
            references: { type: String, required: true },
        },
        postalCode: {
            type: String,
            required: true,
        },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    contact: {
        phone: { type: String, required: false },
        email: { type: String, required: false },
        website: { type: String, required: false },
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    stripeAccount: {
        accountId: {
            type: String,
            required: false
        },
        detailsSubmitted: {
            type: Boolean,
            required: false,
            default: false
        },
        chargesEnabled: {
            type: Boolean,
            required: false,
            default: false
        }
    }
},
{
    timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;