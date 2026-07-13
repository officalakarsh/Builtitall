const express = require('express');
const router = express.Router();
const { getBusinessBySlug } = require('../controllers/businessController');
const { createBooking } = require('../controllers/bookingController');

router.get('/site/:slug', getBusinessBySlug);
router.post('/site/:slug/book', createBooking);

module.exports = router;
