const User = require("./models/User");
const mongoose = require("mongoose");
require('dotenv').config()
const uri = process.env.MONGO_URL;
require('dotenv').config()

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error(err);
});

const createUser = async () => {
    try {
        let data = {
            email: 'uma@gmail.com',
            password: '1234'
        }
        const user = new User(data);
        // console.log(billingPlan);
        await user.save();
        console.log('user created');
    } catch(err) {
        console.log('Unable to save users to mongo: ', err)
    }
}

createUser()