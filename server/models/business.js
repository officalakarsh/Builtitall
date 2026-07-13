const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String },
  duration: { type: String }
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const businessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Please add a business name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Please select a business category'],
    enum: ['hotel', 'restaurant', 'sweet-shop', 'salon', 'gym']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact phone number']
  },
  whatsapp: {
    type: String,
    required: [true, 'Please add a WhatsApp number']
  },
  template: {
    type: String,
    enum: ['modern', 'classic', 'minimalist'],
    default: 'modern'
  },
  theme: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#10B981' },
    backgroundColor: { type: String, default: '#F3F4F6' },
    textColor: { type: String, default: '#1F2937' }
  },
  content: {
    hero: {
      title: { type: String },
      subtitle: { type: String },
      ctaText: { type: String },
      imageUrl: { type: String }
    },
    about: {
      title: { type: String },
      story: { type: String },
      imageUrl: { type: String }
    },
    services: [serviceSchema],
    faqs: [faqSchema],
    contact: {
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      mapsUrl: { type: String }
    }
  },
  seo: {
    title: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    openGraph: {
      title: { type: String },
      description: { type: String },
      image: { type: String }
    }
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create unique slug before validation
businessSchema.pre('validate', function(next) {
  if (this.businessName && !this.slug) {
    this.slug = this.businessName
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')         // Trim - from start
      .replace(/-+$/, '');        // Trim - from end
  }
  next();
});

const MongooseBusiness = mongoose.model('Business', businessSchema);
const { MockBusiness } = require('./mockDb');

const BusinessProxy = new Proxy({}, {
  get: function(target, prop) {
    const isConnected = mongoose.connection.readyState === 1;
    const model = isConnected ? MongooseBusiness : MockBusiness;
    const val = model[prop];
    if (typeof val === 'function') {
      return val.bind(model);
    }
    return val;
  }
});

module.exports = BusinessProxy;
