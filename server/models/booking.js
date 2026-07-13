const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please add booking contact number']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please select a booking date']
  },
  bookingTime: {
    type: String,
    required: [true, 'Please select a booking time']
  },
  service: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MongooseBooking = mongoose.model('Booking', bookingSchema);
const { MockBooking } = require('./mockDb');

const BookingProxy = new Proxy({}, {
  get: function(target, prop) {
    const isConnected = mongoose.connection.readyState === 1;
    const model = isConnected ? MongooseBooking : MockBooking;
    const val = model[prop];
    if (typeof val === 'function') {
      return val.bind(model);
    }
    return val;
  }
});

module.exports = BookingProxy;
