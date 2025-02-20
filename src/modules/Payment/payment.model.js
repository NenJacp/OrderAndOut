const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',  // Relación con la orden
      required: true
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',  // Relación con el restaurante
      required: true
    },
    amount: {
      type: Number,
      required: true  // Monto del pago
    },
    currency: {
      type: String,
      required: true,  // Ejemplo: "MXN"
    },
    payment_method: {
      type: String,
      enum: ['cash', 'stripe'],  // Métodos de pago: efectivo o tarjeta
      required: true
    },
    status: {
      type: String,
      enum: ['successful', 'failed', 'pending'],  // Estados del pago
      default: 'pending'
    },
    cash_received: {
      type: Number,  // Solo relevante para pagos en efectivo
      required: function() { return this.payment_method === 'cash'; }
    },
    change_given: {
      type: Number,  // Solo relevante para pagos en efectivo
      required: function() { return this.payment_method === 'cash'; }
    },
    stripe_payment_id: {
      type: String,  // Solo relevante para pagos con tarjeta
      required: function() { return this.payment_method === 'stripe'; }
    }
},
{
    timestamps: true
});
  
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment;