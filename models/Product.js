const mongoose = require('mongoose');

// Define the user schema and model
const productSchema = new mongoose.Schema({
  id: String,
  product_id: String,
  name: String,
  status: String,
  description: String,
  usage_type: String,
  billing_cycles: Array,
  payment_preferences: Object,
  taxes: Object,
  quantity_supported: Boolean,
  create_time: String,
  update_time: String,
  links: Array
});

module.exports = mongoose.model('product', productSchema);