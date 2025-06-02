require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: 'http://localhost:5173', // Your React app URL
    credentials: true
  })
);
app.use(express.json());

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * 1) Set up Nodemailer transporter with Gmail credentials from .env
 * ──────────────────────────────────────────────────────────────────────────────
 */
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER, // yourgmailaddress@gmail.com
    pass: process.env.GMAIL_PASS  // your Gmail password or app password
  }
});

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * 2) “Contact” endpoint: receives form data (name, email, phone) and sends an email
 * ──────────────────────────────────────────────────────────────────────────────
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const mailOptions = {
      from: `"Webinar Registration Information" <${process.env.GMAIL_USER}>`, 
      to: process.env.GMAIL_USER,                                 // send to the same Gmail
      subject: `New registration from ${name}`,                    // customize subject
      replyTo: email,                                              // “Reply” goes to visitor’s email
      text: `
You have a new registration from your website:

Name: ${name}
Email: ${email}
Phone: ${phone}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact form email sent:', info.messageId);
    return res
      .status(200)
      .json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Error sending contact form email:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to send email. Please try again.' });
  }
});

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * 3) Existing Stripe checkout endpoint and webhook
 * ──────────────────────────────────────────────────────────────────────────────
 */
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
              images: ['https://your-domain.com/webinar-image.jpg']
            },
            unit_amount: amount // Amount in cents ($49.00 = 4900)
          },
          quantity: 1
        }
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
      allow_promotion_codes: true,
      billing_address_collection: 'auto'
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
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('Payment successful for:', session.metadata);
      await handleSuccessfulPayment(session);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSuccessfulPayment(session) {
  const { firstName, lastName, email } = session.metadata;
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
