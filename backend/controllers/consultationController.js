/* 
 * Consultation API Route
 * Handles consultation/booking requests
 */

async function submitConsultation(req, res) {
    try {
      console.log('📋 Consultation request received:', req.body);
      const { name, email, country, reason, subject } = req.body;
  
      if (!name || !email || !country || !reason) {
        console.error('Missing required fields:', { name: !!name, email: !!email, country: !!country, reason: !!reason });
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
  
      // You can use the existing nodemailer transporter from server.js
      // For now, we'll just log and return success
      // In production, this would send an email to the team
  
      const nodemailer = require('nodemailer');
      
      // Check if email credentials are configured
      if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
  
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER, // Send to admin
          subject: `Consultation Request: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #e64726; text-align: center; margin-bottom: 30px;">New Consultation Request</h2>
              
              <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px; color: #fff;">
                <h3 style="color: #fff; margin-top: 0;">Contact Details</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Country:</strong> ${country}</p>
              </div>
              
              <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px; color: #fff;">
                <h3 style="color: #fff; margin-top: 0;">Reason for Booking</h3>
                <p style="white-space: pre-wrap; line-height: 1.6;">${reason}</p>
              </div>
              
              <div style="background-color: #111; padding: 15px; border-radius: 8px; font-size: 12px; color: #888;">
                <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Reply to:</strong> ${email}</p>
              </div>
            </div>
          `,
        };
  
        await transporter.sendMail(mailOptions);
        console.log('✅ Consultation email sent to admin');
      } else {
        console.log('⚠️ Email not configured, logging consultation request only');
        console.log('Consultation details:', { name, email, country, reason });
      }
  
      return res.json({ 
        success: true, 
        message: 'Consultation request submitted successfully!' 
      });
  
    } catch (error) {
      console.error('❌ Error processing consultation request:', error);
      return res.status(500).json({ error: 'Failed to submit request. Please try again.' });
    }
  }
  
  module.exports = { submitConsultation };