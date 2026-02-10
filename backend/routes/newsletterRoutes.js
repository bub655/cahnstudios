const express = require('express');
const { fetchLatestNewsletter } = require('../controllers/newsletterController');

const router = express.Router();

// GET /api/newsletter/latest - Fetch the latest newsletter post
router.get('/latest', fetchLatestNewsletter);

module.exports = router;