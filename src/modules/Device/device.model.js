const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    plan_type: {
        type: String,
        default: 'basic'
    },
    max_active_devices: {
        type: Number,
        default: 5
    },
    active_devices: [
        {
            type: {
                type: String,
                enum: ['kiosk', 'cashier'],
                required: true
            },
            device_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            connected_at: {
                type: Date,
                default: Date.now
            }
        }
    ],
},
{ 
    timestamps: true 
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;