// config/products.js
module.exports = {
  webinar: {
    key: 'webinar',
    name: 'AI for Creators — Live Webinar',
    description: 'Two-day live session + bonus materials',
    stripePriceId: process.env.STRIPE_PRICE_ID_WEBINAR,  // usd
    stripeAmount: 5821,                                   // usd cents (in case you need it)
    razorAmount: 499900,                                  // in paise (₹4 ,999)
  },
  course: {
    key: 'course',
    name: 'AI for Creators — Full Self-Paced Course',
    description: '12 video modules, worksheets, community access',
    stripePriceId: process.env.STRIPE_PRICE_ID_COURSE,
    stripeAmount: 19900,                                  // e.g. $199.00
    razorAmount: 1699900,                                 // e.g. ₹16 ,999
  },
};
