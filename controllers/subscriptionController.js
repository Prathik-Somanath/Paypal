const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const axios = require('axios')

const subscriptionController = {};

subscriptionController.save = async (req, res) => {
    if(!req.session.user){
        res.redirect('/login');
        return;
    }
    const subscription_id = req.query.subscription_id;
	// console.log('ID: ', subscription_id, req.session.user)
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
		axios.get(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscription_id}`, {
			headers: {
				'PayPal-Request-Id': new Date().getTime(),
				'Authorization': `Bearer ${data.access_token}`
			}
		}).then(async ({data}) => {
            let saveSub = data
            saveSub.customer_id = req.session.user?._id
            const subscription = new Subscription(saveSub);
		// console.log(billingPlan);
            await subscription.save();
            console.log('Subscription plan created');
        }).catch(err => console.log('sub data success err: ', err))
	}).catch(err => console.log('sub data success err: ', err))
	res.render('success', {});
}


module.exports = subscriptionController