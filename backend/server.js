// backend/server.js
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
    credentials: true,
  })
);
app.use(express.json());

// 1) Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER, // e.g. youremail@gmail.com
    pass: process.env.GMAIL_PASS, // your Gmail app-password
  },
});

// 2) “Contact” endpoint: send two emails
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // 2a) Mail to yourself with registrant’s details
    const mailOptionsOwner = {
      from: `"Webinar Registration" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // deliver to your own inbox
      subject: `New registration from ${name}`,
      replyTo: email, // reply will go to registrant
      text: `
You have a new registration from your website:

Name:  ${name}
Email: ${email}
Phone: ${phone}
      `.trim(),
    };

    // Send email to yourself
    const infoOwner = await transporter.sendMail(mailOptionsOwner);
    console.log('Owner notification sent:', infoOwner.messageId);

    // 2b) Mail to registrant with a link (e.g., Zoom link or “thank you” page)
    const webinarLink = 'https://cahnstudios.com/'; 
    // ← Replace with your actual webinar or confirmation URL

    const mailOptionsUser = {
      from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
      to: email, // deliver to registrant
      subject: 'Thanks for registering!',
      text: `
Hi ${name},

Thank you for registering for our AI for Creatives webinar!

Here is your personal link to join:
${webinarLink}

We look forward to seeing you there.

– The Cahn Team
      `.trim(),
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for registering for our <strong>AI for Creatives</strong> webinar!</p>
        <p>
          <a href="${webinarLink}" target="_blank" style="color: #1e40af; text-decoration: none; font-weight: bold;">
            Click here to join your webinar
          </a>
        </p>
        <p>We look forward to seeing you there.</p>
        <p>– The Cahn Team</p>
      `,
    };

    // Send email to the registrant
    const infoUser = await transporter.sendMail(mailOptionsUser);
    console.log('Confirmation email sent to user:', infoUser.messageId);

    return res
      .status(200)
      .json({ success: true, message: 'Emails sent successfully.' });
  } catch (err) {
    console.error('Error in /api/contact:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to send emails. Please try again.' });
  }
});

// 3) Stripe checkout endpoint (unchanged)
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
              images: ['https://your-domain.com/webinar-image.jpg'],
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
      customer_email: email,
      metadata: {
        firstName,
        lastName,
        email,
        product: 'AI_for_Creatives_Webinar',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Unable to create checkout session',
      details: error.message,
    });
  }
});

// 4) Stripe webhook endpoint (unchanged)
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
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
  }
);

async function handleSuccessfulPayment(session) {
  const { firstName, lastName, email } = session.metadata;
  console.log(`Registration completed for: ${firstName} ${lastName} (${email})`);
  console.log(`Payment amount: $${session.amount_total / 100}`);
  console.log(`Payment ID: ${session.payment_intent}`);
}

// 5) Health check endpoint (unchanged)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/webhook`);
});
