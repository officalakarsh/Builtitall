const Booking = require('../models/booking');
const Business = require('../models/business');

// Helper to format WhatsApp message
const generateWhatsAppLink = (whatsapp, businessName, customerName, service, date, time, email, phone) => {
  // Clean phone number (remove +, spaces, dashes)
  const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const message = `Hello *${businessName}*,

I would like to request a booking:
📅 *Date:* ${formattedDate}
🕒 *Time:* ${time}
💼 *Service/Product:* ${service || 'General Inquiry'}

*My Contact Details:*
👤 *Name:* ${customerName}
📞 *Phone:* ${phone}
📧 *Email:* ${email}

Please confirm if this slot is available. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

// @desc    Submit a booking for a business (Public tenant route)
// @route   POST /api/public/site/:slug/book
// @access  Public
exports.createBooking = async (req, res) => {
  const { customerName, email, phone, bookingDate, bookingTime, service } = req.body;
  const { slug } = req.params;

  if (!customerName || !email || !phone || !bookingDate || !bookingTime) {
    return res.status(400).json({ success: false, message: 'Please provide all booking details' });
  }

  try {
    const business = await Business.findOne({ slug });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const booking = await Booking.create({
      businessId: business._id,
      customerName,
      email,
      phone,
      bookingDate,
      bookingTime,
      service: service || 'General Inquiry'
    });

    // Generate WhatsApp redirection URL
    const whatsappLink = generateWhatsAppLink(
      business.whatsapp,
      business.businessName,
      customerName,
      service,
      bookingDate,
      bookingTime,
      email,
      phone
    );

    res.status(201).json({
      success: true,
      message: 'Booking request saved successfully',
      data: booking,
      whatsappLink
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings for the logged-in owner's businesses
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    // Find all businesses belonging to the logged-in owner
    const businesses = await Business.find({ ownerId: req.user._id }).select('_id');
    const businessIds = businesses.map(b => b._id);

    // Find all bookings for these businesses
    const bookings = await Booking.find({ businessId: { $in: businessIds } })
      .populate('businessId', 'businessName category slug')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Confirm/Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid booking status' });
  }

  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify booking belongs to a business owned by current user
    const business = await Business.findOne({
      _id: booking.businessId,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(401).json({ success: false, message: 'Unauthorized access to booking' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
