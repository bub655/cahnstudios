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
      console.log('Session object keys:', Object.keys(session));
      console.log('Session metadata:', session.metadata);
      console.log('Session customer_email:', session.customer_email);
      console.log('Session customer_details:', session.customer_details);
      console.log('Session customer:', session.customer);

      try {
        await handleSuccessfulPayment(session);
        console.log('✅ Email handling completed successfully');
      } catch (error) {
        console.error('❌ Error in handleSuccessfulPayment:', error);
      }
    } else {
      console.log('ℹ️ Ignoring event type:', event.type);
      console.log('Available event types we should listen for: checkout.session.completed');
      console.log('Event data object keys:', Object.keys(event.data.object));
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

/* /api/contact: receive form data and send emails */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, country } = req.body;
    if (!name || !email || !phone || !country) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, and country are required.',
      });
    }

    // Email to admin with registrant's details
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

/* Checkout Session */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('📝 Creating checkout session with request body:', req.body);
    const { name, email, phone, country } = req.body;
    const amount = 11599;

    console.log('Extracted data:', { name, email, phone, country });

    if (!name || !email || !phone || !country) {
      console.error('Missing required fields:', {
        name: !!name,
        email: !!email,
        phone: !!phone,
        country: !!country,
      });
      return res
        .status(400)
        .json({ error: 'Name, email, phone, and country are required.' });
    }

    console.log('Creating Stripe session with metadata:', {
      name,
      email,
      phone,
      country,
    });

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

    console.log('✅ Stripe session created successfully:', session.id);
    console.log('Session metadata in response:', session.metadata);
    console.log('Session customer_email in response:', session.customer_email);

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Unable to create checkout session.' });
  }
});

async function handleSuccessfulPayment(session) {
  console.log('📧 Starting email process...');
  console.log('Full session object:', JSON.stringify(session, null, 2));

  let name = session.metadata?.name;
  let email = session.metadata?.email;
  let phone = session.metadata?.phone;
  let country = session.metadata?.country;

  // Fallback: try customer_email field
  if (!email && session.customer_email) {
    email = session.customer_email;
    console.log('Using customer_email as fallback:', email);
  }

  // Fallback: try customer_details
  if (!name && session.customer_details?.name) {
    name = session.customer_details.name;
    console.log('Using customer_details.name as fallback:', name);
  }

  // Fallback: retrieve full session from Stripe API
  if (!name || !email || !country) {
    try {
      console.log('Attempting to retrieve full session from Stripe API...');
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer'],
      });
      console.log('Full session from API:', JSON.stringify(fullSession, null, 2));

      if (!name && fullSession.metadata?.name) {
        name = fullSession.metadata.name;
      }
      if (!email && fullSession.metadata?.email) {
        email = fullSession.metadata.email;
      }
      if (!phone && fullSession.metadata?.phone) {
        phone = fullSession.metadata.phone;
      }
      if (!country && fullSession.metadata?.country) {
        country = fullSession.metadata.country;
      }

      if (!email && fullSession.customer_email) {
        email = fullSession.customer_email;
      }
    } catch (err) {
      console.error('Error retrieving full session:', err);
    }
  }

  console.log('Final customer data:', { name, email, phone, country });

  if (!email) {
    console.error('❌ No email found - cannot send confirmation');
    return;
  }

  if (!name) {
    name = 'Valued Customer';
    console.log('Using fallback name:', name);
  }
  if (!country) {
    country = 'Unknown';
    console.log('Using fallback country:', country);
  }

  console.log('Gmail credentials configured:', {
    user: !!process.env.GMAIL_USER,
    pass: !!process.env.GMAIL_PASS,
  });

  // Email to registrant
  const mailOptions = {
    from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to AI for Creators - Webinar 2.0!',
    text: `
Hi ${name},

Thank you for registering for "AI for Creators" — we’re thrilled to have you join us for this high-impact session designed to supercharge your creative workflows using AI!

📅 Webinar Date: 21.06.2025 & 22.06.2025
🕒 Time: 7:30 PM – 9:30 PM (IST) & 7:00 AM – 9:00 AM (PST)
📍 Where: Live on Zoom — Link coming soon!

We see you’re joining us from ${country}!

What to Expect:
• The best AI tools for writing, video, design & ads  
• Prompt engineering secrets that unlock powerful results  
• Smart workflows to scale content and campaigns  
• Real-world case studies and ethical guardrails  
• A downloadable handout with tools, tips, and templates

Expect a mix of demos, live walkthroughs, creative challenges, and Q&A time — no fluff, just action-ready insights.

Come with a project idea in mind — you’ll leave with ways to accelerate it using AI!  
We’ll be sending a reminder with the Zoom link and your downloadable handout closer to the date.

Meanwhile, feel free to reply if you have any questions or ideas you’d love covered in the session.

Can’t wait to see you there!

Warmly,  
Team Cahn
    `.trim(),
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <p>Hi ${name},</p>

        <p>Thank you for registering for <strong>AI for Creators</strong> — we’re thrilled to have you join us for this high-impact session designed to supercharge your creative workflows using AI!</p>

        <p>
          <strong>📅 Webinar Date:</strong> 21.06.2025 &amp; 22.06.2025<br>
          <strong>🕒 Time:</strong> 7:30 PM – 9:30 PM (IST) &amp; 7:00 AM – 9:00 AM (PST)<br>
          <strong>📍 Where:</strong> Live on Zoom — Link coming soon!
        </p>

        <p>We see you’re joining us from <strong>${country}</strong>!</p>

        <p><strong>What to Expect:</strong></p>
        <ul style="margin-left: 1rem; color: #333;">
          <li>The best AI tools for writing, video, design &amp; ads</li>
          <li>Prompt engineering secrets that unlock powerful results</li>
          <li>Smart workflows to scale content and campaigns</li>
          <li>Real-world case studies and ethical guardrails</li>
          <li>A downloadable handout with tools, tips, and templates</li>
        </ul>

        <p>Expect a mix of demos, live walkthroughs, creative challenges, and Q&amp;A time — <strong>no fluff, just action-ready insights.</strong></p>

        <p>Come with a project idea in mind — you’ll leave with ways to accelerate it using AI! We’ll be sending a reminder with the Zoom link closer to the date.</p>

        <p>Feel free to reply if you have any questions.</p>

        <p>Can’t wait to see you there!</p>
        <p>Warmly,<br>Team Cahn</p>
      </div>
    `.trim(),
  };

  try {
    console.log('📤 Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    console.log('Email info:', info);

    // Send notification email to yourself (admin)
    const notificationOptions = {
      from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Registration: AI for Creators Webinar - ${name}`,
      text: `
New registration received:

Name: ${name}
Email: ${email}
Phone: ${phone}
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
    console.log('✅ Notification email sent to admin');
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
      frontEndUrl: process.env.FRONT_END_URL || 'not set',
    },
    timestamp: new Date().toISOString(),
  });
});

/* Test endpoint to verify session creation */
app.post('/api/test-session', async (req, res) => {
  try {
    console.log('🧪 TEST: Creating test session');

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

    console.log('✅ Test session created:', testSession.id);
    console.log('Test session metadata:', testSession.metadata);

    return res.json({
      success: true,
      sessionId: testSession.id,
      metadata: testSession.metadata,
    });
  } catch (error) {
    console.error('❌ Test session failed:', error);
    return res.status(500).json({ error: error.message });
  }
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
