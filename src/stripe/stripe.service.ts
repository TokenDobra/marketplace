import { Injectable } from '@nestjs/common';


@Injectable()
export class StripeService {
   private SERVER_DOMAIN:string;

   constructor() {
     this.SERVER_DOMAIN = process.env.SERVER_DOMAIN;
   }

   async checkout(items, order_uuid, success, cancel)
   {

       const stripe = require('stripe')(process.env.STRIPE_KEY);

       return await stripe.checkout.sessions.create({
              line_items: items,
              mode: 'payment',
              metadata: {'order_uuid': order_uuid},
              success_url: `${this.SERVER_DOMAIN}/${success}?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${this.SERVER_DOMAIN}/${cancel}?session_id={CHECKOUT_SESSION_ID}`,
        });
   }
   async retrieve(session_id)
   {
     const stripe = require('stripe')(process.env.STRIPE_KEY);
     return await stripe.checkout.sessions.retrieve(session_id);
   }


}
/*
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));
*/