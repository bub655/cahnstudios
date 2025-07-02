// backend/routes/courseRoutes.js
const express = require('express');
const stripeController   = require('../controllers/stripeController');
const razorpayController = require('../controllers/razorpayController');

const router = express.Router();

const addProductKey = productKey =>
  (handler) => (req, res, next) => {
    req.productKey = productKey;
    return handler(req, res, next);
  };

router.post(
  '/stripe/create-checkout-session',
  addProductKey('course')(stripeController.createCheckoutSession)
);

router.post(
  '/stripe/payment-success',
  express.raw({ type: 'application/json' }),
  stripeController.handleWebhook
);

router.post(
  '/razorpay/create-order',
  addProductKey('course')(razorpayController.createOrder)
);

router.post(
  '/razorpay/webhook/payment-success',
  razorpayController.handleWebhook
);

module.exports = router;
