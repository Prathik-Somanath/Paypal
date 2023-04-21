const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const userController = require('./controllers/userController');
const subscriptionController = require('./controllers/subscriptionController');
const productController = require('./controllers/productController');
require('dotenv').config()

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;
// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error(err);
});

// Set up session middleware
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));

// Set up flash middleware
app.use(flash());

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set up the public directory
app.use(express.static('public'));

// Set up body parsing middleware
app.use(express.urlencoded({ extended: true }));


// home screen dashboard but route to login if not
// Set up the dashboard route
app.get('/', (req, res) => {
    // If the user is not logged in, redirect to the login page
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }
  
    res.render('dashboard', { user: req.session.user });
});

// Set up the login route
app.get('/login', (req, res) => {
  res.render('login', { errorMessage: req.flash('error') });
});

app.post('/login', async (req, res) => {
  userController.login(req, res)
});

// Set up the dashboard route
app.get('/dashboard', async (req, res) => {
	productController.list(req, res)
});

// Set up the logout route
app.get('/logout', (req, res) => {
  userController.logout(req,res)
});

app.get('/success', (req, res) => {
	subscriptionController.save(req,res)
});

app.get('/cancel', (req, res) => {
	res.render('cancel', { errorMessage: req.flash('error') });
});

// // Handle PayPal webhook events
// app.post('/webhook', (req, res) => {
//   const webhookEvent = (req);
//   // console.log('Received PayPal webhook:', JSON.stringify(req.body));
//   // console.log('Received PayPal TEST:', JSON.parse(req.body));
// 	console.log(webhookEvent);
//   // Handle the webhook event

// 	var webhookId = "7TS30013G9146615R";
// 	var eventBody = JSON.stringify(req.body)

// 	let headers = {
// 		'webhook_id': webhookId,
//     'auth_algo': req.headers['paypal-auth-algo'],
//     'cert_url': req.headers['paypal-cert-url'],
//     'transmission_id': req.headers['paypal-transmission-id'],
//     'transmission_sig': req.headers['paypal-transmission-sig'],
//     'transmission_time': req.headers['paypal-transmission-time'],
// 		'webhook_event': eventBody
// 	};

// 	axios.post(
// 		'https://api-m.sandbox.paypal.com/v1/oauth2/token',
// 		new URLSearchParams({
// 			'grant_type': 'client_credentials'
// 		}),
// 		{
// 			auth: {
// 				username: process.env.PAYPAL_CLIENT_ID,
// 				password: process.env.PAYPAL_CLIENT_SECRET
// 			}
// 		}
// 	)
// 	.then(({data}) => {
// 		console.log(data.access_token)
// 		axios.post(
// 			'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
// 			JSON.stringify(headers),
// 			{
// 				headers: {
// 					'Content-Type': 'application/json',
// 					'PayPal-Request-Id': new Date().getTime(),
// 					'Authorization': `Bearer ${data.access_token}`
// 				}
// 			}
// 		)
// 		.then(({data}) => {
// 			console.log('verified: ', data)
// 		}).catch(err => console.log('error while verify', err))
// 	}).catch(err => console.log('error while auth', err))
// 	// console.log(eventBody)
// // 	paypal.notification.webhookEvent.verify(headers, eventBody, webhookId, function (error, response) {
// //     if (error) {
// //         console.log(error);
// //         throw error;
// //     } else {
// //         console.log(response);

// //         // Verification status must be SUCCESS
// //         if (response.verification_status === "SUCCESS") {
// //             console.log("It was a success.");
// //         } else {
// //             console.log("It was a failed verification");
// //         }
// //     }
// // 	});
// //   // ...
// //   res.sendStatus(200);
// });


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
