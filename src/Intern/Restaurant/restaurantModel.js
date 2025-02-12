////////////////////////////////////////////////////////////
//                     Restaurant Model                  ///
////////////////////////////////////////////////////////////

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
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        }
    },
    adminId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Admin',
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
