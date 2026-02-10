const express = require('express');
const { submitConsultation } = require('../controllers/consultationController');

const router = express.Router();

// POST /api/consultation - Submit a consultation request
router.post('/', submitConsultation);

module.exports = router;