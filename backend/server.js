// old server.
// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const Razorpay = require("razorpay");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      'https://www.cahnstudios.com',
      'https://cahnstudios.com', 
      'https://cahn-webinar-individual-ivi7.vercel.app',
      'http://localhost:5173',
      'http://localhost:3001'
    ],
    credentials: true,
  })
);

/* Webhook: on checkout.session.completed → send confirmation email */
/* This MUST come BEFORE express.json() middleware */
app.post(
  '/stripe/payment-success',
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
      console.log('Session object keys:', Object.keys(session));
      console.log('Session metadata:', session.metadata);
      console.log('Session customer_email:', session.customer_email);
      console.log('Session customer_details:', session.customer_details);
      console.log('Session customer:', session.customer);
      
      try {

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
        await handleSuccessFullEmail({name, email, phone, country, type: 'stripe', id: session.id});
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


/* Checkout Session */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('📝 Creating checkout session with request body:', req.body);
    const { name, email, phone, country} = req.body;
    // const amount = 5821; //monetary value
    const amount = 2000;

    console.log('Extracted data:', { name, email, phone, country });

    if (!name || !email || !phone || !country) {
      console.error('Missing required fields:', { name: !!name, email: !!email, phone: !!phone, country: !!country });
      return res.status(400).json({ error: 'Name, email, phone, and country are required.' });
    }

    console.log('Creating Stripe session with metadata:', { name, email, phone });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              // name: 'AI for Creators Webinar',
              // description: 'Live webinar + materials',
              name: 'AI for Creators Course',
              description: 'On-demand course',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONT_END_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_END_URL}/payment-selection`,
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

async function handleSuccessFullEmail(paymentData) {
  console.log('📧 Starting email process...');
  const { name, email, phone, country, type, id } = paymentData;

  console.log('Final customer data: ', { name, email, phone, country, type, id });

  if (!email) {
    console.error('❌ No email found - cannot send confirmation');
    return;
  }

  if (!name) {
    name = 'Valued Customer'; // Fallback name
    console.log('Using fallback name:', name);
  }

  console.log('Gmail credentials configured:', {
    user: !!process.env.GMAIL_USER,
    pass: !!process.env.GMAIL_PASS
  });
  
//   const mailOptions = {
//     from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
//     to: email,
//   subject: 'Welcome to AI for Creators - Webinar 2.0!',
//     text: `
// Hi,

// Thank you for registering for "AI for Creators" — we're thrilled to have you join us for this high-impact session designed to supercharge your creative workflows using AI!

// 📅 Webinar Date: 21.06.2025 & 22.06.2025
// 🕒 Time: 7:30 PM – 9:30 PM (IST) & 7:00 AM – 9:00 AM (PST)
// 📍 Where: Live on Zoom — Link coming soon!

// What to Expect:
// These interactive sessions are crafted for creators, marketers, and entrepreneurs ready to work with AI, not against it. You'll learn:

// • The best AI tools for writing, video, design & ads  
// • Prompt engineering secrets that unlock powerful results  
// • Smart workflows to scale content and campaigns  
// • Real-world case studies and ethical guardrails  
// • A downloadable handout with tools, tips, and templates

// Expect a mix of demos, live walkthroughs, creative challenges, and Q&A time — no fluff, just action-ready insights.

// Come with a project idea in mind — you'll leave with ways to accelerate it using AI!  
// We'll be sending a reminder with the Zoom link and your downloadable handout closer to the date.  

// Meanwhile, feel free to reply if you have any questions or ideas you'd love covered in the session.

// Can't wait to see you there!

// Warmly,  
// Team Cahn
//     `.trim(),
//     html: `
//     <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
//       <p>Hi,</p>

//       <p>
//         Thank you for registering for <strong>AI for Creators</strong> — we're thrilled to have you join us for this high-impact session designed to supercharge your creative workflows using AI!
//       </p>

//       <p>
//         <strong>📅 Webinar Date:</strong> 21.06.2025 &amp; 22.06.2025<br>
//         <strong>🕒 Time:</strong> 7:30 PM – 9:30 PM (IST) &amp; 7:00 AM – 9:00 AM (PST)<br>
//         <strong>📍 Where:</strong> Live on Zoom — Link coming soon!
//       </p>

//       <p><strong>What to Expect:</strong><br>
//       These interactive sessions are crafted for <strong>creators, marketers, and entrepreneurs</strong> ready to work with AI, not against it. You'll learn:</p>

//       <ul style="margin-left: 1rem; color: #333;">
//         <li>The best AI tools for writing, video, design &amp; ads</li>
//         <li>Prompt engineering secrets that unlock powerful results</li>
//         <li>Smart workflows to scale content and campaigns</li>
//         <li>Real-world case studies and ethical guardrails</li>
//         <li>A downloadable handout with tools, tips, and templates</li>
//       </ul>

//       <p>
//         Expect a mix of demos, live walkthroughs, creative challenges, and Q&amp;A time — <strong>no fluff, just action-ready insights.</strong>
//       </p>

//       <p>
//         Come with a project idea in mind — you'll leave with ways to accelerate it using AI!<br>
//         We'll be sending a reminder with the Zoom link and your downloadable handout closer to the date.
//       </p>

//       <p>
//         Meanwhile, feel free to reply if you have any questions or ideas you'd love covered in the session.
//       </p>

//       <p>Can't wait to see you there!</p>

//       <p>Warmly,<br>Team Cahn</p>
//     </div>
//   `.trim(),
//   };

const mailOptions = {
  from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
  to: email,
  subject: 'Access Your AI for Creators Course 🎓',
  text: `
Hi ${name || ''},

Thank you for showing interest in our AI for Creators course! We’re excited to help you accelerate your content creation and business workflows using powerful AI tools.

🎥 Below are your private course recordings:
1. Part 1: https://vimeo.com/your-link-1
2. Part 2: https://vimeo.com/your-link-2

🔐 Password to access all recordings: #

These sessions cover:
• The best tools for AI content creation (video, writing, design)
• Automation workflows for scaling faster
• Real-world use cases, demos, and bonus templates

If you have any questions or need help getting started, feel free to reply to this email.

Let’s build smarter, faster, and more creatively with AI.

Warm regards,  
Team Cahn
  `.trim(),
  html: `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <p>Hi ${name || ''},</p>

    <p>
      Thank you for showing interest in our <strong>AI for Creators course</strong>! We're excited to help you accelerate your content creation and business workflows using powerful AI tools.
    </p>

    <p><strong>🎥 Your private course recordings:</strong></p>
    <ul>
      <li><a href="https://vimeo.com/your-link-1" target="_blank">Part 1 Recording</a></li>
      <li><a href="https://vimeo.com/your-link-2" target="_blank">Part 2 Recording</a></li>
    </ul>

    <p><strong>🔐 Password to access all recordings:</strong> <code>#</code></p>

    <p>This course covers:</p>
    <ul>
      <li>The best tools for AI content creation (video, writing, design)</li>
      <li>Automation workflows for scaling faster</li>
      <li>Real-world use cases, demos, and bonus templates</li>
    </ul>

    <p>
      If you have any questions or want to share your project ideas, just hit reply — we’d love to hear from you!
    </p>

    <p>Let’s build smarter, faster, and more creatively with AI.</p>

    <p>Warm regards,<br><strong>Team Cahn</strong></p>
  </div>
  `.trim(),
};

  try {
  console.log('📤 Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
  console.log('✅ Email sent successfully! Message ID:', info.messageId);
  console.log('Email info:', info);

  // Send notification email to yourself
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
Payment Type: ${type}
ID: ${id}
Registration Time: ${new Date().toISOString()}
    `.trim(),
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2>New Registration Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Payment Type:</strong> ${type}</p>
        <p><strong>Payment ID:</strong> ${id}</p>
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
      frontEndUrl: process.env.FRONT_END_URL || 'not set'
    },
    timestamp: new Date().toISOString()
  });
});

/* Test endpoint to verify session creation */
app.post('/api/test-session', async (req, res) => {
  try {
    console.log('🧪 TEST: Creating test session');
    
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


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    console.log('📝 Creating Razorpay order with request body:', req.body);
    const { name, email, phone, country } = req.body;

    console.log('Extracted customer data:', { name, email, phone, country });

    if (!name || !email || !phone || !country) {
      console.error('Missing required fields for Razorpay order:', { name: !!name, email: !!email, phone: !!phone, country: !!country });
      return res.status(400).json({ error: 'Name, email, phone, and country are required.' });
    }

    const options = {
      // amount: 499900, // amount in the smallest currency unit (₹4,999)
      amount: 199900, // amount in the smallest currency unit (₹2,000)
      currency: "INR",
      receipt: `receipt_${email}`,
      notes: {
        name: name,
        email: email,
        phone: phone,
        country: country
      }
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created successfully:', order.id);
    console.log('Order notes:', order.notes);
    
    // Return order details along with the key_id (key_id is safe to expose, key_secret is not)
    return res.json({
      ...order,
      key_id: process.env.RAZORPAY_KEY_ID // Only send the key_id, never the secret
    });
  } catch (err) {
    console.error('❌ Error creating Razorpay order:', err);
    return res.status(500).send(err);
  }
});

/* Razorpay Payment Success Handler */
app.post('/api/razorpay/webhook/payment-success', async (req, res) => {
  try {
    console.log('🚨 WEBHOOK CALLED - Raw request received');
    console.log('Headers:', req.headers);
    console.log('Body size:', req.body?.length || 0);

    const event = req.body.event;
    const payload = req.body.payload;
    console.log('Event:', event);
    console.log('Payload:', payload);
    const paymentEntity = payload.payment.entity;

    const email = paymentEntity.email;
    const phone = paymentEntity.contact;
    const name = paymentEntity.notes?.name || 'No name given'; // if you passed name in notes
    const country = paymentEntity.country || 'N/A';
    const payment_id = paymentEntity.id;
    const order_id = paymentEntity.order_id;

    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Country:", country);
    console.log("Name:", name);

    console.log('Payment details:', { payment_id, order_id });

    if (!payment_id || !order_id) {
      return res.status(400).json({ error: 'Payment ID and Order ID are required' });
    }

    console.log('Customer data from order:', { name, email, phone, country });

    if (!email) {
      console.error('❌ No email found in order notes');
      return res.status(400).json({ error: 'Customer email not found' });
    }

    console.log('Sending confirmation email...');
    // Send confirmation email (same function as Stripe)
    await handleSuccessFullEmail({ name, email, phone, country, type: 'razorpay', id: payment_id });
    console.log('✅ Email sent successfully!');
    return res.json({ 
      success: true, 
      message: 'Payment verified and confirmation email sent',
      payment_id,
      order_id 
    });

  } catch (error) {
    console.error('❌ Error in Razorpay payment success handler:', error);
    return res.status(500).json({ error: 'Failed to process payment confirmation' });
  }
});

/* Contact form endpoint */
app.post('/api/contact', async (req, res) => {
  try {
    console.log('📧 Contact form submission received:', req.body);
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      console.error('Missing required contact form fields:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Send email to admin
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to same email (admin)
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center; margin-bottom: 30px;">New Contact Form Submission</h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #555; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #555; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; font-size: 12px; color: #666;">
            <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Reply to:</strong> ${email}</p>
          </div>
        </div>
      `,
    };

    console.log('Sending contact form emails...');
    
    // Send both emails
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact form notification sent to admin');

    return res.json({ 
      success: true, 
      message: 'Contact form submitted successfully!' 
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

/* Initial engagement tracking endpoint */
app.post('/api/track-engagement', async (req, res) => {
  try {
    console.log('📊 Initial engagement tracked:', req.body);
    const { name, email, phone, country } = req.body;

    if (!name || !email || !phone || !country) {
      console.error('Missing required fields for engagement tracking:', { name: !!name, email: !!email, phone: !!phone, country: !!country });
      return res.status(400).json({ error: 'All fields are required for engagement tracking.' });
    }

    // Send engagement notification to cahnwebinar@gmail.com
    const engagementOptions = {
      from: process.env.GMAIL_USER,
      to: 'cahnwebinar@gmail.com',
      subject: `Initial Engagement Click - ${name}`,
      html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2>New Registration Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>
      </div>
    `.trim(),
    };

    console.log('Sending engagement tracking email...');
    await transporter.sendMail(engagementOptions);
    console.log('✅ Engagement tracking email sent to cahnwebinar@gmail.com');

    return res.json({ 
      success: true, 
      message: 'Engagement tracked successfully!' 
    });

  } catch (error) {
    console.error('❌ Error tracking engagement:', error);
    return res.status(500).json({ error: 'Failed to track engagement.' });
  }
});

/* Home route */
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

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/stripe/payment-success`);
});