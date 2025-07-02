// backend/services/emailService.js
const nodemailer = require('nodemailer');

/* ──────────────────────────────────────────
   1)  Transporter (Gmail)
   ────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* ──────────────────────────────────────────
   2)  Main helper: send two emails
   ────────────────────────────────────────── */
async function sendCustomerAndAdminEmails(paymentData) {
  /* Destructure ONCE */
  const {
    name: rawName = 'Valued Customer',
    email,
    phone,
    country,
    type: gateway,     // rename to avoid future clashes
    id,
  } = paymentData;

  if (!email) {
    console.error('❌ No email provided – skipping mail send');
    return;
  }

  const name = rawName || 'Valued Customer';

  /* ---------- Customer confirmation ---------- */
  const customerOptions = {
    from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
    to:   email,
    subject: 'Welcome to AI for Creators – Webinar 2.0!',
    text: `
Hi ${name},

Thank you for registering for "AI for Creators" — we’re thrilled to have you join us!

📅  Date: 21 & 22 Jun 2025
🕒  Time: 7:30 PM–9:30 PM IST · 7 AM–9 AM PST
📍  Live on Zoom (link coming soon)

Watch your inbox for a reminder with the Zoom link and downloadable handout.
See you there!

Team Cahn
`.trim(),
    html: `
<div style="font-family:sans-serif;line-height:1.5;color:#333;">
  <p>Hi ${name},</p>
  <p>
    Thank you for registering for <strong>AI for Creators</strong> — we’re
    thrilled to have you join us!
  </p>

  <p>
    <strong>📅 Date:</strong> 21 & 22 Jun 2025<br>
    <strong>🕒 Time:</strong> 7:30 PM–9:30 PM IST · 7 AM–9 AM PST<br>
    <strong>📍 Where:</strong> Live on Zoom (link coming soon)
  </p>

  <p>
    We’ll send a reminder with the Zoom link and your handout closer to the date.
  </p>

  <p>Can’t wait to see you there!</p>
  <p>Warmly,<br>Team Cahn</p>
</div>
`.trim(),
  };

  /* ---------- Admin notification ---------- */
  const adminOptions = {
    from: `"Cahn Studios" <${process.env.GMAIL_USER}>`,
    to:   process.env.GMAIL_USER,
    subject: `New Registration – AI for Creators – ${name}`,
    html: `
<div style="font-family:sans-serif;line-height:1.5;color:#333;">
  <h2>New Registration Received</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Country:</strong> ${country}</p>
  <p><strong>Gateway:</strong> ${gateway}</p>
  <p><strong>Payment ID:</strong> ${id}</p>
  <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
</div>
`.trim(),
  };

  /* ---------- Send emails ---------- */
  try {
    console.log('📤 Sending confirmation to customer…');
    await transporter.sendMail(customerOptions);

    console.log('📤 Sending notification to admin…');
    await transporter.sendMail(adminOptions);

    console.log(`✅ Emails sent successfully for payment ${id}`);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
  }
}

module.exports = { sendCustomerAndAdminEmails };
