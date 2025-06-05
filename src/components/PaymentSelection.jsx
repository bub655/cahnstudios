import React, { useState, useEffect } from 'react';

const PaymentSelection = () => {
  const [formData, setFormData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState('');

  useEffect(() => {
    // Retrieve form data from sessionStorage
    const storedData = sessionStorage.getItem('registrationData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    } else {
      // If no form data, redirect back to registration
      window.location.href = '/';
    }
  }, []);

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setProcessingMethod('stripe');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod: 'stripe' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start Stripe payment. Please try again.');
        setIsProcessing(false);
        setProcessingMethod('');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
      setProcessingMethod('');
    }
  };

  const handleRazorpayPayment = () => {
    setIsProcessing(true);
    setProcessingMethod('razorpay');
    // Directly redirect to the external link
    window.location.href = 'https://rzp.io/rzp/5I2Axrj'; //RazorPay Link by Vishnu
  };

  const goBack = () => {
    window.history.back();
  };

  if (!formData) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Choose Your Payment Method
        </h2>
        
        {/* Registration Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Registration Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <p className="text-gray-800">{formData.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-800">{formData.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>
              <p className="text-gray-800">{formData.phone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Country:</span>
              <p className="text-gray-800">{formData.country}</p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Select Payment Method
          </h3>
          
          {/* Stripe Button */}
          <button
            onClick={handleStripePayment}
            disabled={isProcessing}
            className={`w-full p-6 border-2 rounded-lg transition-all duration-200 ${
              isProcessing && processingMethod === 'stripe'
                ? 'bg-blue-100 border-blue-300 cursor-not-allowed'
                : 'bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Pay with Stripe</h4>
                  <p className="text-sm text-gray-600">Credit/Debit Cards, Digital Wallets</p>
                </div>
              </div>
              {isProcessing && processingMethod === 'stripe' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <span className="text-blue-600 font-medium">Choose →</span>
              )}
            </div>
          </button>

          {/* Razorpay Button */}
          <button
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className={`w-full p-6 border-2 rounded-lg transition-all duration-200 ${
              isProcessing && processingMethod === 'razorpay'
                ? 'bg-indigo-100 border-indigo-300 cursor-not-allowed'
                : 'bg-white border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Pay with Razorpay</h4>
                  <p className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets</p>
                </div>
              </div>
              {isProcessing && processingMethod === 'razorpay' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              ) : (
                <span className="text-indigo-600 font-medium">Choose →</span>
              )}
            </div>
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={goBack}
          disabled={isProcessing}
          className="w-full py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Go Back to Registration
        </button>
      </div>
    </section>
  );
};


// Add Razorpay payment link creation endpoint
app.post('/api/create-razorpay-payment', async (req, res) => {
  const { name, email, phone, country } = req.body;
  
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLinkRequest = {
      amount: 5000, // Amount in paise (₹50.00)
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
      callback_url: 'https://cahnstudios.com/success',
      callback_method: 'get'
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
    
    res.json({ url: paymentLink.short_url });
  } catch (error) {
    console.error('Error creating Razorpay payment link:', error);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});


// Add Razorpay webhook endpoint (similar to Stripe webhook)
app.post(
  '/api/razorpay-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('🚨 RAZORPAY WEBHOOK CALLED - Raw request received');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    try {
      const event = JSON.parse(req.body.toString());
      console.log('Razorpay event type:', event.event);
      console.log('Razorpay event data:', event.payload);

      if (event.event === 'payment.captured' || event.event === 'payment_link.paid') {
        console.log("🎉 RAZORPAY PAYMENT COMPLETED EVENT RECEIVED");
        const payment = event.payload.payment;
        
        // Extract customer data from payment notes or description
        const customerData = {
          name: payment.notes?.name || 'Valued Customer',
          email: payment.notes?.email || payment.email,
          phone: payment.notes?.phone || payment.contact,
          country: payment.notes?.country || 'Not specified',
          payment_id: payment.entity.id,
          amount: payment.entity.amount / 989900, // Razorpay sends amount in paise
          method: payment.entity.method
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

// Create separate function for Razorpay email handling
async function handleRazorpaySuccessfulPayment(customerData) {
  console.log('📧 Starting Razorpay email process...');
  
  const { name, email, phone, country, payment_id, amount, method } = customerData;

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
    console.log('📤 Attempting to send Razorpay confirmation email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Razorpay email sent successfully! Message ID:', info.messageId);

    // Send notification email to yourself
    const notificationOptions = {
      from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Registration: AI for Creators Webinar - ${name} (Razorpay)`,
      text: `
New registration received via Razorpay:

Name: ${name}
Email: ${email}
Phone: ${phone}
Country: ${country}
Payment ID: ${payment_id}
Amount: $${amount}
Payment Method: ${method}
Registration Time: ${new Date().toISOString()}
      `.trim(),
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>New Registration Received (Razorpay)</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Payment ID:</strong> ${payment_id}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Payment Method:</strong> ${method}</p>
          <p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `.trim(),
    };

    await transporter.sendMail(notificationOptions);
    console.log('✅ Razorpay notification email sent to admin');

  } catch (err) {
    console.error('❌ Razorpay email sending failed:', err);
    console.error('Error details:', err.message);
  }
}

export default PaymentSelection;
