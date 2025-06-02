const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));
app.use(express.json());

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { firstName, lastName, email, amount } = req.body;
    
    console.log('Creating checkout session for:', { firstName, lastName, email });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI for Creatives Webinar',
              description: 'Live interactive webinar + recording + bonus materials',
              images: ['https://your-domain.com/webinar-image.jpg'], // Optional
            },
            unit_amount: amount, // Amount in cents ($49.00 = 4900)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
      customer_email: email,
      metadata: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        product: 'AI_for_Creatives_Webinar'
      },
      allow_promotion_codes: true, // Allow discount codes
      billing_address_collection: 'auto',
    });

    res.json({ 
      url: session.url,
      sessionId: session.id 
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Unable to create checkout session',
      details: error.message 
    });
  }
});

// Webhook to handle successful payments
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for:', session.metadata);
      
      // Here you would typically:
      // 1. Save registration to your database
      // 2. Send confirmation email to customer
      // 3. Add user to your webinar platform (Zoom, etc.)
      // 4. Send calendar invite
      
      // Example of what you might do:
      await handleSuccessfulPayment(session);
      break;
      
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Function to handle successful payment
async function handleSuccessfulPayment(session) {
  const { firstName, lastName, email } = session.metadata;
  
  // Here you would:
  // 1. Save to database
  // 2. Send confirmation email
  // 3. Add to webinar platform
  
  console.log(`Registration completed for: ${firstName} ${lastName} (${email})`);
  console.log(`Payment amount: $${session.amount_total / 100}`);
  console.log(`Payment ID: ${session.payment_intent}`);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/webhook`);
});