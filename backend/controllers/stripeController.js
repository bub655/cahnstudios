// backend/controllers/stripeController.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = require('../config/products');
const { sendCustomerAndAdminEmails } = require('../services/emailService');

/* ─────────────────────────────────────────────
   1)  Create Stripe Checkout Session
   ───────────────────────────────────────────── */
exports.createCheckoutSession = async (req, res) => {
  try {
    // The router injects req.productKey; fall back to body for flexibility
    const productKey = req.productKey || req.body.productKey;
    const { name, email, phone, country } = req.body;

    /* Basic validation */
    if (!productKey || !products[productKey]) {
      return res.status(400).json({ error: 'Unknown product.' });
    }
    if (!name || !email || !phone || !country) {
      return res.status(400).json({ error: 'Missing required customer fields.' });
    }

    const prod = products[productKey];

    /* Create the session */
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: prod.stripePriceId,   // Price created in Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONT_END_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url : `${process.env.FRONT_END_URL}/payment-selection`,
      customer_email: email,
      metadata: { name, email, phone, country, productKey },
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return res.status(500).json({ error: 'Unable to create checkout session.' });
  }
};

/* ─────────────────────────────────────────────
   2)  Handle Stripe Webhook
   Path: /stripe/payment-success
   Raw body parser is mounted in the router
   ───────────────────────────────────────────── */
exports.handleWebhook = async (req, res) => {
  let event;

  /* Verify signature */
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,                       // raw Buffer provided by express.raw
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  /* Handle checkout.session.completed */
  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object;
    const md       = session.metadata || {};

    const payload = {
      name       : md.name    || session.customer_details?.name || 'Customer',
      email      : md.email   || session.customer_email,
      phone      : md.phone,
      country    : md.country,
      productKey : md.productKey,
      type       : 'stripe',
      id         : session.id,
    };

    try {
      await sendCustomerAndAdminEmails(payload);
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
      // Do not throw; we still acknowledge the webhook
    }
  }

  return res.json({ received: true });
};
