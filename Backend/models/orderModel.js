const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: Number
  }],
  amount: {
    type: Number,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Khalti', 'eSewa', 'Stripe'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Delivered'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
