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
            number: { type: String },
            crossStreets: { type: String },
            colony: { type: String, required: true },
            references: { type: String },
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
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
},
{
    timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;