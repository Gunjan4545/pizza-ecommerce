const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model (if you have one)
       
      },
      quantity: {
        type: Number, 
      },
    },
  ],
customizeIngradients:{
    cheese:{
      type:String
    },
    sauce:{
      type:String
    },
    base:{
      type:String
    },
    veggies:[String],

    quantity: {
      type: Number, 
    },


  },
  productTotalPrice: {
    type:Number,
  },
  customizeTotalPrice: {
    type:Number,
  },
  
  shippingInfo: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true, // This should include the subtotal and any additional charges
  },
  status: {
    type: String,
    enum: ['Order received', 'In the kitchen', 'Sent to delivery', 'Delivered'],
    default: 'Order received',
  },
  payment_id: String,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
