// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String, // Assuming you store the image URL or file path
  cheese: String,
  sauce: String,
  base: String,
  veggies: [String],
});

module.exports = mongoose.model('Product', productSchema);
