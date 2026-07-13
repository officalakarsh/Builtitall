const express = require('express');
const router = express.Router();
const { getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all routes under this file

router.get('/', getBookings);
router.put('/:id/status', updateBookingStatus);

module.exports = router;
