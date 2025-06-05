// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ['https://cahn-webinar-individual-ivi7.vercel.app', 'http://localhost:5173'],
    credentials: true,
  })
);

/* Stripe Webhook: on checkout.session.completed → send confirmation email */
/* This MUST come BEFORE express.json() middleware */
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('🚨 STRIPE WEBHOOK CALLED - Raw request received');
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
      console.log('Session customer_email:', session.customer_email);
      
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

/* Razorpay Webhook: on payment.captured → send confirmation email */
app.post(
  '/api/razorpay-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('🚨 RAZORPAY WEBHOOK CALLED - Raw request received');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body.toString());
    
    try {
      const event = JSON.parse(req.body.toString());
      console.log('Razorpay event type:', event.event);
      console.log('Razorpay event payload:', event.payload);

      if (event.event === 'payment.captured' || event.event === 'payment_link.paid') {
        console.log("🎉 RAZORPAY PAYMENT COMPLETED EVENT RECEIVED");
        
        // Correct data structure access for Razorpay
        const paymentEntity = event.payload.payment.entity;
        console.log('Payment entity:', paymentEntity);
        
        const customerData = {
          name: paymentEntity.notes?.name || 'Valued Customer',
          email: paymentEntity.notes?.email,
          phone: paymentEntity.notes?.phone,
          country: paymentEntity.notes?.country || 'Not specified',
          payment_id: paymentEntity.id,
          amount: paymentEntity.amount / 100, // Convert paise to rupees
          method: paymentEntity.method
        };

        console.log('Razorpay customer data:', customerData);

        if (customerData.email) {
          await handleRazorpaySuccessfulPayment(customerData);
          console.log('✅ Razorpay email handling completed successfully');
        } else {
          console.error('❌ No email found in Razorpay payment data');
        }
      } else {
        console.log('ℹ️ Ignoring Razorpay event type:', event.event);
      }

      res.json({ status: 'success' });
    } catch (error) {
      console.error('❌ Error processing Razorpay webhook:', error);
      res.status(400).json({ error: 'Webhook processing failed' });
    }
  }
);

/* Apply JSON parsing AFTER the webhook endpoints */
app.use(express.json());

/* Nodemailer transporter (Gmail) */
const transporter = nodemailer.createTransporter({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* Stripe Checkout Session Creation */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('📝 Creating checkout session with request body:', req.body);
    const { name, email, phone, country } = req.body;
    const amount = 11599; // $115.99 in cents

    console.log('Extracted data:', { name, email, phone, country });

    if (!name || !email || !phone || !country) {
      console.error('Missing required fields:', { name: !!name, email: !!email, phone: !!phone, country: !!country });
      return res.status(400).json({ error: 'Name, email, phone, and country are required.' });
    }

    console.log('Creating Stripe session with metadata:', { name, email, phone, country });

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

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Unable to create checkout session.' });
  }
});

/* Razorpay Payment Link Creation */
app.post('/api/create-razorpay-payment', async (req, res) => {
  console.log('📝 Creating Razorpay payment with request body:', req.body);
  const { name, email, phone, country } = req.body;
  
  if (!name || !email || !phone || !country) {
    console.error('Missing required fields for Razorpay:', { name: !!name, email: !!email, phone: !!phone, country: !!country });
    return res.status(400).json({ error: 'Name, email, phone, and country are required.' });
  }
  
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLinkRequest = {
      amount: 989900, // Indian rupee
      currency: 'INR',
      description: 'AI for Creators Webinar Registration',
      customer: {
        name: name,
        email: email,
        contact: phone
      },
      notes: {
        name: name,
        email: email,
        phone: phone,
        country: country
      },
      callback_url: `${process.env.FRONT_END_URL}/success`,
      callback_method: 'get'
    };

    console.log('Creating Razorpay payment link with request:', paymentLinkRequest);

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
    
    console.log('✅ Razorpay payment link created successfully:', paymentLink.id);
    
    res.json({ url: paymentLink.short_url });
  } catch (error) {
    console.error('Error creating Razorpay payment link:', error);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});

/* Handle Stripe successful payment */
async function handleSuccessfulPayment(session) {
  console.log('📧 Starting Stripe email process...');
  console.log('Full session object:', JSON.stringify(session, null, 2));
  
  // Try multiple ways to get customer data
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

  // Fallback: try to retrieve full session from Stripe API
  if (!name || !email) {
    try {
      console.log('Attempting to retrieve full session from Stripe API...');
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer']
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
      
      // Try customer_email again
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
    name = 'Valued Customer'; // Fallback name
    console.log('Using fallback name:', name);
  }

  await sendConfirmationEmail(name, email, phone, country, session.id, 'stripe');
}

/* Handle Razorpay successful payment */
async function handleRazorpaySuccessfulPayment(customerData) {
  console.log('📧 Starting Razorpay email process...');
  
  const { name, email, phone, country, payment_id } = customerData;
  
  await sendConfirmationEmail(name, email, phone, country, payment_id, 'razorpay');
}

/* Consolidated email sending function */
async function sendConfirmationEmail(name, email, phone, country, transactionId, paymentMethod) {
  console.log('Gmail credentials configured:', {
    user: !!process.env.GMAIL_USER,
    pass: !!process.env.GMAIL_PASS
  });
  
  const mailOptions = {
    from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to AI for Creators - Webinar 2.0!',
    text: `
Hi ${name},

Thank you for registering for "AI for Creators" — we're thrilled to have you join us for this high-impact session designed to supercharge your creative workflows using AI!

📅 Webinar Date: 21.06.2025 & 22.06.2025
🕒 Time: 7:30 PM – 9:30 PM (IST) & 7:00 AM – 9:00 AM (PST)
📍 Where: Live on Zoom — Link coming soon!

What to Expect:
These interactive sessions are crafted for creators, marketers, and entrepreneurs ready to work with AI, not against it. You'll learn:

• The best AI tools for writing, video, design & ads  
• Prompt engineering secrets that unlock powerful results  
• Smart workflows to scale content and campaigns  
• Real-world case studies and ethical guardrails  
• A downloadable handout with tools, tips, and templates

Expect a mix of demos, live walkthroughs, creative challenges, and Q&A time — no fluff, just action-ready insights.

Come with a project idea in mind — you'll leave with ways to accelerate it using AI!  
We'll be sending a reminder with the Zoom link and your downloadable handout closer to the date.  

Meanwhile, feel free to reply if you have any questions or ideas you'd love covered in the session.

Can't wait to see you there!

Warmly,  
Team Cahn
    `.trim(),
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <p>Hi ${name},</p>

        <p>
          Thank you for registering for <strong>AI for Creators</strong> — we're thrilled to have you join us for this high-impact session designed to supercharge your creative workflows using AI!
        </p>

        <p>
          <strong>📅 Webinar Date:</strong> 21.06.2025 &amp; 22.06.2025<br>
          <strong>🕒 Time:</strong> 7:30 PM – 9:30 PM (IST) &amp; 7:00 AM – 9:00 AM (PST)<br>
          <strong>📍 Where:</strong> Live on Zoom — Link coming soon!
        </p>

        <p><strong>What to Expect:</strong><br>
        These interactive sessions are crafted for <strong>creators, marketers, and entrepreneurs</strong> ready to work with AI, not against it. You'll learn:</p>

        <ul style="margin-left: 1rem; color: #333;">
          <li>The best AI tools for writing, video, design &amp; ads</li>
          <li>Prompt engineering secrets that unlock powerful results</li>
          <li>Smart workflows to scale content and campaigns</li>
          <li>Real-world case studies and ethical guardrails</li>
          <li>A downloadable handout with tools, tips, and templates</li>
        </ul>

        <p>
          Expect a mix of demos, live walkthroughs, creative challenges, and Q&amp;A time — <strong>no fluff, just action-ready insights.</strong>
        </p>

        <p>
          Come with a project idea in mind — you'll leave with ways to accelerate it using AI!<br>
          We'll be sending a reminder with the Zoom link and your downloadable handout closer to the date.
        </p>

        <p>
          Meanwhile, feel free to reply if you have any questions or ideas you'd love covered in the session.
        </p>

        <p>Can't wait to see you there!</p>

        <p>Warmly,<br>Team Cahn</p>
      </div>
    `.trim(),
  };

  try {
    console.log('📤 Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    console.log('Email info:', info);

    // Send notification email to admin
    const notificationOptions = {
      from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Registration: AI for Creators Webinar - ${name} (${paymentMethod.toUpperCase()})`,
      text: `
New registration received via ${paymentMethod.toUpperCase()}:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Country: ${country || 'Not provided'}
Transaction ID: ${transactionId}
Registration Time: ${new Date().toISOString()}
      `.trim(),
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>New Registration Received (${paymentMethod.toUpperCase()})</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Country:</strong> ${country || 'Not provided'}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `.trim(),
    };

    await transporter.sendMail(notificationOptions);
    console.log('✅ Notification email sent to admin');

  } catch (err) {
    console.error('❌ Email sending failed:', err);
    console.error('Error details:', err.message);
    
    // Log more detailed error info
    if (err.code) {
      console.error('Error code:', err.code);
    }
    if (err.response) {
      console.error('SMTP response:', err.response);
    }
  }
}

/* Health check endpoint */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: {
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      razorpayConfigured: !!process.env.RAZORPAY_KEY_ID,
      emailConfigured: !!process.env.GMAIL_USER,
      frontendUrl: process.env.FRONT_END_URL || 'not configured'
    }
  });
});

/* Webhook test endpoint */
app.get('/api/webhook-test', (req, res) => {
  res.json({ 
    status: 'Webhook endpoint is accessible',
    environment: {
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      razorpayKeyId: !!process.env.RAZORPAY_KEY_ID,
      razorpayKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      gmailUser: !!process.env.GMAIL_USER,
      gmailPass: !!process.env.GMAIL_PASS,
      frontEndUrl: process.env.FRONT_END_URL || 'not set'
    },
    timestamp: new Date().toISOString()
  });
});

/* Test endpoint to verify Stripe session creation */
app.post('/api/test-session', async (req, res) => {
  try {
    console.log('🧪 TEST: Creating test Stripe session');
    
    const testSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Test Product' },
          unit_amount: 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      customer_email: 'test@example.com',
      metadata: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-1234',
        country: 'US'
      },
    });

    console.log('✅ Test session created:', testSession.id);
    console.log('Test session metadata:', testSession.metadata);
    
    return res.json({ 
      success: true, 
      sessionId: testSession.id,
      metadata: testSession.metadata 
    });
  } catch (error) {
    console.error('❌ Test session failed:', error);
    return res.status(500).json({ error: error.message });
  }
});

/* Test email endpoint */
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('🧪 TEST: Sending test email');
    
    await sendConfirmationEmail(
      'Test User',
      process.env.GMAIL_USER, // Send to yourself for testing
      '555-1234',
      'US',
      'test_transaction_123',
      'test'
    );
    
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/* Root endpoint */
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Cahn Studios - Webinar Backend</title>
        <style>
          body { 
            background: #111; 
            color: #fff; 
            font-family: sans-serif; 
            text-align: center; 
            padding-top: 60px; 
            line-height: 1.6;
          }
          .status { font-size: 2rem; margin-bottom: 1rem; }
          .info { margin: 0.5rem 0; }
          .endpoints { 
            max-width: 600px; 
            margin: 2rem auto; 
            text-align: left; 
            background: #222; 
            padding: 2rem; 
            border-radius: 8px;
          }
          .endpoint { 
            margin: 1rem 0; 
            padding: 0.5rem; 
            background: #333; 
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="status">✅ Cahn Studios Backend Server</div>
        <div class="info">Environment: <b>${process.env.NODE_ENV || 'development'}</b></div>
        <div class="info">Port: <b>${PORT}</b></div>
        <div class="info">Status: <b>Running</b></div>
        
        <div class="endpoints">
          <h3>Available Endpoints:</h3>
          <div class="endpoint">
            <strong>POST /api/create-checkout-session</strong><br>
            Create Stripe checkout session
          </div>
          <div class="endpoint">
            <strong>POST /api/create-razorpay-payment</strong><br>
            Create Razorpay payment link
          </div>
          <div class="endpoint">
            <strong>POST /api/webhook</strong><br>
            Stripe webhook endpoint
          </div>
          <div class="endpoint">
            <strong>POST /api/razorpay-webhook</strong><br>
            Razorpay webhook endpoint
          </div>
          <div class="endpoint">
            <strong>GET /api/health</strong><br>
            Health check and environment status
          </div>
          <div class="endpoint">
            <strong>POST /api/test-email</strong><br>
            Test email functionality
          </div>
        </div>
      </body>
    </html>
  `);
});

/* Start server */
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Stripe webhook: http://localhost:${PORT}/api/webhook`);
  console.log(`🔗 Razorpay webhook: http://localhost:${PORT}/api/razorpay-webhook`);
  console.log('📧 Email service:', process.env.GMAIL_USER ? 'Configured' : 'Not configured');
  console.log('💳 Stripe:', process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured');
  console.log('💰 Razorpay:', process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured');
});