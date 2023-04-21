const mongoose = require('mongoose');

// Define the user schema and model
const userSchema = new mongoose.Schema({
	email: {
			type: String,
			unique: true,
			required: true
	},
	password: {
			type: String,
			required: true
	}
});

module.exports = mongoose.model('user', userSchema);