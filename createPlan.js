const paypal = require('paypal-rest-sdk');
const Product = require("./models/Product");
const mongoose = require("mongoose");
require('dotenv').config()
const uri = process.env.MONGO_URL;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error(err);
});

require('dotenv').config()
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

const createPlan = () => {
  return new Promise((resolve, reject) => {
    const plan = {
      name: 'Netflix',
      description: 'Monthly subscription plan',
      type: 'infinite',
      payment_definitions: [
        {
          name: 'Regular payment',
          type: 'REGULAR',
          frequency_interval: '1',
          frequency: 'MONTH',
          cycles: '0',
          amount: {
            value: '10',
            currency: 'USD'
          }
        }
      ],
      merchant_preferences: {
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
        auto_bill_amount: 'YES',
        initial_fail_amount_action: 'CONTINUE',
        max_fail_attempts: '0'
      }
    };
    
    paypal.billingPlan.create(plan, (error, billingPlan) => {
      if (error) {
        reject(error);
      } else {
        resolve(billingPlan);
      }
    });
  });
};

createPlan().then(async(billingPlan) => {
  const product = new Product(billingPlan);
  console.log(billingPlan);
  await product.save();
  console.log('Billing plan created');

  const billingPlanUpdateAttributes = [{
    "op": "replace",
    "path": "/",
    "value": {
        "state": "ACTIVE"
    }
  }];
  // required to activate the plane after creating
  paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, 
    function(error, response){
    if (error) {
        console.log(error);
    } else {
        console.log(billingPlan.id, response);
    }
  });
}).catch((error) => {
  console.log('Error creating billing plan:');
  console.log(error);
});