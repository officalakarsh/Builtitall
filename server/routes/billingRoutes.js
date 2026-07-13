const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook } = require('../controllers/billingController');
const { protect } = require('../middleware/auth');

router.post('/checkout', protect, createCheckoutSession);
router.post('/webhook', handleWebhook);

module.exports = router;
