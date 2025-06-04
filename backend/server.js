// “Contact” endpoint: send two emails
// app.post('/api/contact', async (req, res) => {
//   try {
//     const { name, email, phone } = req.body;

//     // 2a) Mail to yourself with registrant's details
//     const mailOptionsOwner = {
//       from: `"Webinar Registration" <${process.env.GMAIL_USER}>`,
//       to: process.env.GMAIL_USER, // deliver to your own inbox
//       subject: `New registration from ${name}`,
//       replyTo: email, // reply will go to registrant
//       text: `
// You have a new registration from your website:

// Name:  ${name}
// Email: ${email}
// Phone: ${phone}
//       `.trim(),
//     };

//     // Send email to yourself
//     const infoOwner = await transporter.sendMail(mailOptionsOwner);
//     console.log('Owner notification sent:', infoOwner.messageId);

//     // 2b) Mail to registrant with a link (e.g., Zoom link or "thank you" page)
//     const webinarLink = 'https://cahnstudios.com/'; 
//     // ← Replace with your actual webinar or confirmation URL

//     const mailOptionsUser = {
//       from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
//       to: email, // deliver to registrant
//       subject: 'Thanks for registering!',
//       text: `
// Hi ${name},

// Thank you for registering for our AI for Creatives webinar!

// Here is your personal link to join:
// ${webinarLink}

// We look forward to seeing you there.

// – The Cahn Team
//       `.trim(),
//       html: `
//         <p>Hi ${name},</p>
//         <p>Thank you for registering for our <strong>AI for Creatives</strong> webinar!</p>
//         <p>
//           <a href="${webinarLink}" target="_blank" style="color: #1e40af; text-decoration: none; font-weight: bold;">
//             Click here to join your webinar
//           </a>
//         </p>
//         <p>We look forward to seeing you there.</p>
//         <p>– The Cahn Team</p>
//       `,
//     };

//     // Send email to the registrant
//     const infoUser = await transporter.sendMail(mailOptionsUser);
//     console.log('Confirmation email sent to user:', infoUser.messageId);

//     return res
//       .status(200)
//       .json({ success: true, message: 'Emails sent successfully.' });
//   } catch (err) {
//     console.error('Error in /api/contact:', err);
//     return res
//       .status(500)
//       .json({ success: false, error: 'Failed to send emails. Please try again.' });
//   }
// });


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
    origin: process.env.FRONT_END_URL || 'https://cahn-webinar-individual-ivi7.vercel.app' || 'http://localhost:5173',
    credentials: true,
  })
);

/* Webhook: on checkout.session.completed → send confirmation email */
/* This MUST come BEFORE express.json() middleware */
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('🚨 WEBHOOK CALLED - Raw request received');
    console.log('Headers:', req.headers);
    console.log('Body size:', req.body?.length || 0);
    
    const sig = req.headers['stripe-signature'];
    console.log('Stripe signature present:', !!sig);
    console.log('Webhook secret configured:', !!process.env.STRIPE_WEBHOOK_SECRET);
    
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('✅ Webhook signature verified successfully');
      console.log('Event type:', event.type);
      console.log('Event ID:', event.id);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      console.log("🎉 CHECKOUT SESSION COMPLETED EVENT RECEIVED");
      const session = event.data.object;
      console.log('Session ID:', session.id);
      console.log('Payment status:', session.payment_status);
      console.log('Session metadata:', session.metadata);
      
      try {
        await handleSuccessfulPayment(session);
        console.log('✅ Email handling completed successfully');
      } catch (error) {
        console.error('❌ Error in handleSuccessfulPayment:', error);
      }
    } else {
      console.log('ℹ️ Ignoring event type:', event.type);
    }

    res.json({ received: true });
  }
);

/* Apply JSON parsing AFTER the webhook endpoint */
app.use(express.json());

/* Nodemailer transporter (Gmail) */
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* Checkout Session */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const amount = 100; //monitary value

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI for Creators Webinar',
              description: 'Live webinar + materials',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONT_END_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_END_URL}/cancel`,
      customer_email: email,
      metadata: {
        name: name,
        email: email,
        phone: phone,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Unable to create checkout session.' });
  }
});

async function handleSuccessfulPayment(session) {
  console.log('📧 Starting email process...');
  
  // Retrieve our metadata fields from session
  const name = session.metadata?.name;
  const email = session.metadata?.email;
  const phone = session.metadata?.phone;

  console.log('Customer data:', { name, email, phone });

  if (!email || !name) {
    console.error('❌ Missing required customer data:', { name, email, phone });
    return;
  }

  console.log('Gmail credentials configured:', {
    user: !!process.env.GMAIL_USER,
    pass: !!process.env.GMAIL_PASS
  });

  // Compose and send the confirmation email now that payment is done
  const webinarLink = 'https://www.cahnstudios.com';
  
  const mailOptions = {
    from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your Webinar Registration is Confirmed!',
    text: `
Hi ${name},

Thanks for completing payment for our AI for Creators Webinar! 🎉

Here is your personal link to join the webinar:
${webinarLink}

We look forward to seeing you there.

– The Cahn Team
    `.trim(),
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for completing payment for our <strong>AI for Creators Webinar</strong>! 🎉</p>
      <p>
        <a href="${webinarLink}" target="_blank" style="color:rgb(57, 87, 167); text-decoration: none; font-weight: bold;">
          Click here to join the webinar
        </a>
      </p>
      <p>We look forward to seeing you there. If you have questions, reply to this email.</p>
      <p>– The Cahn Team</p>
    `,
  };

  try {
    console.log('📤 Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    console.log('Email info:', info);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    console.error('Error details:', err.message);
  }
}

/* Health check */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/* Webhook test endpoint */
app.get('/api/webhook-test', (req, res) => {
  res.json({ 
    status: 'Webhook endpoint is accessible',
    environment: {
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      gmailUser: !!process.env.GMAIL_USER,
      gmailPass: !!process.env.GMAIL_PASS,
      frontEndUrl: process.env.FRONT_END_URL || 'not set'
    },
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/webhook`);
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Server Status</title>
        <style>
          body { background: #111; color: #fff; font-family: sans-serif; text-align: center; padding-top: 60px; }
          .status { font-size: 2rem; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="status">✅ Backend server is running!</div>
        <div>Environment: <b>${process.env.NODE_ENV || 'development'}</b></div>
        <div>Port: <b>${PORT}</b></div>
      </body>
    </html>
  `);
});