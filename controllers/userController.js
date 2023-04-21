const mongoose = require("mongoose");
const User = require("../models/User");

const userController = {};

userController.login = async (req, res) => {
	const { email, password } = req.body;
	// Find the user with the provided email
	const user = await User.findOne({ email });
	// If the user does not exist, show an error message
	if (!user) {
		req.flash('error', 'Invalid email or password');
		res.redirect('/login');
		return;
	}

	// If the user exists, compare the provided password with the user password
	const passwordMatch = (password === user.password);

	// If the passwords match, set the session user and redirect to the dashboard
	if (passwordMatch) {
		req.session.user = user;
		res.redirect('/dashboard');
	} else {
		res.render('login', { errorMessage: req.flash('error') });
	}
}

userController.logout = async (req, res) => {
	req.session.destroy();
  res.redirect('/login');
}

module.exports = userController