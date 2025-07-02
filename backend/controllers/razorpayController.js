const products = require('../config/products');
const razorpay = require('razorpay');
const { sendCustomerAndAdminEmails } = require('../services/emailService');
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.createOrder = async (req, res) => {
  const { name, email, phone, country, productKey } = req.body;

  const prod = products[productKey];
  if (!prod) return res.status(400).json({ error: 'Unknown product.' });

  const order = await razorpay.orders.create({
    amount   : prod.razorAmount,
    currency : 'INR',
    receipt  : `receipt_${email}`,
    notes    : { name, email, phone, country, productKey },
  });

  res.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
};

exports.handleSuccessfulPayment = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  // Verify the payment signature
  const crypto = require('crypto');
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');

  if (generatedSignature !== signature) {
    return res.status(400).json({ error: 'Invalid signature.' });
  }

  // Here you can save the payment details to your database
  // await savePaymentToDatabase({ order_id, payment_id, signature });

  // Send confirmation emails
  await sendCustomerAndAdminEmails(req.body);

  res.status(200).json({ message: 'Payment processed successfully.' });
};
