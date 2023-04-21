const Product = require("./models/Product");
const mongoose = require("mongoose");
require('dotenv').config()
const uri = process.env.MONGO_URL;
const axios = require('axios');
require('dotenv').config()

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error(err);
});

axios.post(
  'https://api-m.sandbox.paypal.com/v1/oauth2/token',
  new URLSearchParams({
    'grant_type': 'client_credentials'
  }),
  {
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET
    }
  }
)
.then(({data}) => {
	createProduct(data.access_token)
}).catch(err => console.log('error while auth'))


const createProduct = (authToken) => {
	axios.post(
		'https://api-m.sandbox.paypal.com/v1/catalogs/products',
		{
			'name': 'DC Magazines',
			'type': 'PHYSICAL',
			'id': new Date().getTime(),
			'description': '1 Magazine per month',
			'category': 'BOOKS_AND_MAGAZINES',
			// 'image_url': 'https://example.com/gallary/images/1682060101.jpg',
			// 'home_url': 'https://example.com/catalog/1682060101.jpg'
		},
		{
			headers: {
			'Content-Type': 'application/json',
			'PayPal-Request-Id': new Date().getTime(),
			'Authorization': `Bearer ${authToken}`
			}
		}
		).then(({data}) => {
			createSubPlan(authToken, data.id)
		}).catch(err => console.log('Error creating a product:', err))
}

const createSubPlan = (authToken, productID) => {
	axios.post(
		'https://api-m.sandbox.paypal.com/v1/billing/plans',
		{
			'product_id': productID,
			'name': 'DC Magazine',
			'description': 'Read latest DC magazine',
			'status': 'ACTIVE',
			'billing_cycles': [
				{
					'frequency': {
						'interval_unit': 'MONTH',
						'interval_count': 1
					},
					'tenure_type': 'REGULAR',
					'sequence': 1,
					'total_cycles': 0,
					'pricing_scheme': {
						'fixed_price': {
							'value': '15',
							'currency_code': 'USD'
						}
					}
				}
			],
			'payment_preferences': {
				'auto_bill_outstanding': true,
				// 'setup_fee': {
				// 	'value': '10',
				// 	'currency_code': 'USD'
				// },
				'setup_fee_failure_action': 'CONTINUE',
				'payment_failure_threshold': 3
			},
			'taxes': {
				'percentage': '0',
				'inclusive': false
			}
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'PayPal-Request-Id': new Date().getTime(),
				'Prefer': 'return=representation',
				'Authorization': `Bearer ${authToken}`
			}
		}
	).then(async({data}) => {
		const product = new Product(data);
		// console.log(billingPlan);
		await product.save();
		console.log('Subscription plan created');
	}).catch(err => console.log('err while creating sub plan: ', err))
}