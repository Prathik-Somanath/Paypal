const paypal = require('paypal-rest-sdk');
require('dotenv').config()
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

const createAgreement = (planId) => {
  return new Promise((resolve, reject) => {
    const isoDate = new Date();
    isoDate.setSeconds(isoDate.getSeconds() + 4);
    isoDate.toISOString().slice(0, 19) + 'Z';

    const agreement = {
      name: 'Monthly Subscription',
      description: 'Monthly subscription plan',
      start_date: isoDate,
      plan: {
        id: planId
      },
      payer: {
        payment_method: 'paypal'
      }
    };

    paypal.billingAgreement.create(agreement, (error, billingAgreement) => {
      if (error) {
        reject(error);
      } else {
        resolve(billingAgreement);
      }
    });
  });
};

createAgreement('P-15J91501FY397701WUADNC4Y').then((billingAgreement) => {
  console.log('Billing agreement created:');
  console.log(billingAgreement);
}).catch((error) => {
  console.log('Error creating billing agreement:');
  console.log(error);
});