const mongoose = require('mongoose');

// Define the user schema and model
const subscriptionSchema = new mongoose.Schema({
  status: String,
  status_update_time: String,
  id: String,
  plan_id: String,
  start_time: String,
  quantity: String,
  shipping_amount: Object,
  subscriber: Object,
  billing_info: Object,
  create_time: String,
  update_time: String,
  plan_overridden: Boolean,
  links: Array,
  customer_id: String
});

module.exports = mongoose.model('subscription', subscriptionSchema);