const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stripeTransactionSchema = new Schema({
  userReff: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  stripeTransactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ['succeeded', 'pending', 'failed'], 
  },
  description: String, 
  metadata: Schema.Types.Mixed, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', stripeTransactionSchema);
