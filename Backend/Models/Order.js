const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation', 
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', 
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'paid',
        'failed',
        'shipped',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    tags: {
      type: [String], // array of strings
      default: ['MuqtiRath' , 'Empower'],    // optional: default empty array
    },
    paymentMethod: {
      type: String,
      enum: ['wallet', 'credit_card', 'debit_card', 'upi', 'cod'],
      required: true,
    },
    transactionId: {
      type: String, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
