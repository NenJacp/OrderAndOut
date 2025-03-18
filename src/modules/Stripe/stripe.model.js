import mongoose from 'mongoose';

const stripeAccountSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        unique: true
    },
    stripeAccountId: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    payoutsEnabled: {
        type: Boolean,
        default: false
    },
    chargesEnabled: {
        type: Boolean,
        default: false
    },
    detailsSubmitted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const StripeAccount = mongoose.model('StripeAccount', stripeAccountSchema);
export default StripeAccount; 