const mongoose = require('mongoose');

// Define the cart schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model if the cart is associated with a user
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product model for the cart items
      required: true
    },
    quantity: {
      type: Number,
      default:1
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = {Cart};