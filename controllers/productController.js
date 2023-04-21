const mongoose = require("mongoose");
const Product = require("../models/Product");
const Subscription = require("../models/Subscription")
const moment = require('moment')

const productController = {};

productController.list = async (req, res) => {
// If the user is not logged in, redirect to the login page
	if (!req.session.user) {
		res.redirect('/login');
		return;
	}
	const products = await Product.find();
	const subscription = await Subscription.find({ customer_id: req.session.user._id, status: 'ACTIVE' })
	res.render('dashboard', { user: req.session.user, products, subscription, moment: moment });
}


module.exports = productController