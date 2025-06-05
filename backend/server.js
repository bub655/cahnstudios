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
    origin: '*' || 'https://cahn-webinar-individual-ivi7.vercel.app' || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON bodies for all non-webhook routes
app.use(express.json());

// Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* ----------------------------------------------------------------------
   1) /api/contact: receive “Register Now” form data and send two emails
   ---------------------------------------------------------------------- */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, country } = req.body;
    if (!name || !email || !phone || !country) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, and country are required.',
      });
    }

    // Email to admin with registrant’s details
    const mailOptionsOwner = {
      from: `"Webinar Registration" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New registration from ${name}`,
      replyTo: email,
      text: `
You have a new registration from your website:

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Country: ${country}
      `.trim(),
    };
    await transporter.sendMail(mailOptionsOwner);

    // Confirmation email to registrant
    const mailOptionsUser = {
      from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thanks for registering!',
      text: `
Hi ${name},

Thank you for registering for our AI for Creators webinar!

We see you’re joining us from ${country}.

Here is your personal link to join:
https://cahnstudios.com/

We look forward to seeing you there.

– The Cahn Team
      `.trim(),
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for registering for our <strong>AI for Creators</strong> webinar!</p>
        <p>We see you’re joining us from <strong>${country}</strong>.</p>
        <p>
          <a href="https://cahnstudios.com/" target="_blank" style="color: #1e40af; text-decoration: none; font-weight: bold;">
            Click here to join your webinar
          </a>
        </p>
        <p>We look forward to seeing you there.</p>
        <p>– The Cahn Team</p>
      `.trim(),
    };
    await transporter.sendMail(mailOptionsUser);

    return res.status(200).json({ success: true, message: 'Emails sent.' });
  } catch (err) {
    console.error('Error in /api/contact:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to send emails. Please try again.' });
  }
});

/* ----------------------------------------------------------------------
   2) Stripe webhook: on checkout.session.completed → send confirmation email
   ---------------------------------------------------------------------- */
/* This must come before express.json() middleware */
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('🚨 WEBHOOK CALLED');
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      try {
        await handleSuccessfulPayment(session);
        console.log('✅ Payment emails sent successfully');
      } catch (error) {
        console.error('Error in handleSuccessfulPayment:', error);
      }
    }

    res.json({ received: true });
  }
);

/* ----------------------------------------------------------------------
   3) /api/create-checkout-session: create a Stripe checkout session
   ---------------------------------------------------------------------- */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { name, email, phone, country } = req.body;
    const amount = 11599; // $115.99

    if (!name || !email || !phone || !country) {
      return res.status(400).json({
        error: 'Name, email, phone, and country are required.',
      });
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
        country: country,
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
  let name = session.metadata?.name;
  let email = session.metadata?.email;
  let phone = session.metadata?.phone;
  let country = session.metadata?.country;

  if (!email && session.customer_email) {
    email = session.customer_email;
  }
  if (!name && session.customer_details?.name) {
    name = session.customer_details.name;
  }
  if (!country && session.metadata?.country) {
    country = session.metadata.country;
  }

  if (!email) {
    console.error('No email found—cannot send confirmation');
    return;
  }
  if (!name) {
    name = 'Valued Customer';
  }
  if (!country) {
    country = 'Unknown';
  }

  // Email to registrant
  const mailOptions = {
    from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to AI for Creators - Webinar 2.0!',
    text: `
Hi ${name},

Thank you for registering for "AI for Creators"—we’re thrilled to have you join from ${country}!

Webinar Date: 21.06.2025 & 22.06.2025
Time: 7:30 PM – 9:30 PM (IST) & 7:00 AM – 9:00 AM (PST)
Where: Live on Zoom — Link coming soon!

What to Expect:
• AI tools for writing, video, design & ads
• Prompt engineering secrets
• Smart workflows to scale content
• Real-world case studies
• A downloadable handout with tools & tips

Expect demos, live walkthroughs, creative challenges, and Q&A—no fluff, just action-ready insights.

We’ll send a reminder with the Zoom link closer to the date. Meanwhile, feel free to reply with any questions.

Can’t wait to see you there!

– Team Cahn
    `.trim(),
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <p>Hi ${name},</p>
        <p>Thank you for registering for <strong>AI for Creators</strong>—we’re thrilled to have you join from <strong>${country}</strong>!</p>
        <p>
          <strong>Webinar Date:</strong> 21.06.2025 &amp; 22.06.2025<br>
          <strong>Time:</strong> 7:30 PM – 9:30 PM (IST) &amp; 7:00 AM – 9:00 AM (PST)<br>
          <strong>Where:</strong> Live on Zoom — Link coming soon!
        </p>
        <p><strong>What to Expect:</strong></p>
        <ul style="margin-left: 1rem; color: #333;">
          <li>AI tools for writing, video, design &amp; ads</li>
          <li>Prompt engineering secrets</li>
          <li>Smart workflows to scale content</li>
          <li>Real-world case studies</li>
          <li>A downloadable handout with tools &amp; tips</li>
        </ul>
        <p>Expect demos, live walkthroughs, creative challenges, and Q&amp;A—no fluff, just action-ready insights.</p>
        <p>We’ll send a reminder with the Zoom link closer to the date. Meanwhile, feel free to reply with any questions.</p>
        <p>Can’t wait to see you there!</p>
        <p>– Team Cahn</p>
      </div>
    `.trim(),
  };

  await transporter.sendMail(mailOptions);

  // Notification email to admin
  const notificationOptions = {
    from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `New Registration: AI for Creators - ${name}`,
    text: `
New registration received:

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Country: ${country}
Session ID: ${session.id}
Payment Status: ${session.payment_status}
Registration Time: ${new Date().toISOString()}
    `.trim(),
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2>New Registration Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Session ID:</strong> ${session.id}</p>
        <p><strong>Payment Status:</strong> ${session.payment_status}</p>
        <p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>
      </div>
    `.trim(),
  };

  await transporter.sendMail(notificationOptions);
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
      frontEndUrl: process.env.FRONT_END_URL || 'not set',
    },
    timestamp: new Date().toISOString(),
  });
});

/* Test endpoint to verify session creation */
app.post('/api/test-session', async (req, res) => {
  try {
    const testSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Test Product' },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      customer_email: 'test@example.com',
      metadata: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-1234',
      },
    });

    return res.json({
      success: true,
      sessionId: testSession.id,
      metadata: testSession.metadata,
    });
  } catch (error) {
    console.error('Test session failed:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
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
