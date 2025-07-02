// backend/controllers/contactController.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

exports.sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to:   process.env.GMAIL_USER,
    subject: `Contact Form: ${subject}`,
    html: `<p><b>${name}</b> (${email}) says:</p><pre>${message}</pre>`,
  });

  res.json({ success: true });
};
