const Business = require('../models/business');
const { generateAIWebsiteData } = require('../services/geminiService');

// @desc    Create new business website using AI
// @route   POST /api/businesses
// @access  Private
exports.createBusiness = async (req, res) => {
  const { businessName, category, address, phone, whatsapp, description, template } = req.body;

  if (!businessName || !category || !address || !phone || !whatsapp) {
    return res.status(400).json({ success: false, message: 'Please enter all required business details' });
  }

  try {
    // Generate slug and make sure it's unique
    let slug = businessName
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    // Check if slug exists, append random suffix if it does
    const existing = await Business.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Call Gemini AI service to generate content, theme and SEO
    console.log(`Generating AI content for ${businessName} (${category})...`);
    const aiData = await generateAIWebsiteData(businessName, category, address, phone, description);

    // Prepare full business model payload
    const businessPayload = {
      ownerId: req.user._id,
      businessName,
      slug,
      category,
      address,
      phone,
      whatsapp,
      template: template || 'modern',
      theme: aiData.theme,
      content: aiData.content,
      seo: aiData.seo
    };

    const business = await Business.create(businessPayload);

    res.status(201).json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all businesses for the current owner
// @route   GET /api/businesses
// @access  Private
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ ownerId: req.user._id });
    res.status(200).json({ success: true, count: businesses.length, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single business by ID
// @route   GET /api/businesses/:id
// @access  Private
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update business details
// @route   PUT /api/businesses/:id
// @access  Private
exports.updateBusiness = async (req, res) => {
  try {
    let business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    // Update fields
    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    await Business.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Regenerate AI content or SEO for existing site
// @route   POST /api/businesses/:id/regenerate
// @access  Private
exports.regenerateBusiness = async (req, res) => {
  const { description } = req.body;

  try {
    const business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    console.log(`Regenerating AI content for ${business.businessName}...`);
    const aiData = await generateAIWebsiteData(
      business.businessName,
      business.category,
      business.address,
      business.phone,
      description || ''
    );

    // Update content, theme, and SEO
    business.theme = aiData.theme;
    business.content = aiData.content;
    business.seo = aiData.seo;

    await business.save();

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get business by Slug (PUBLIC tenant route)
// @route   GET /api/public/site/:slug
// @access  Public
exports.getBusinessBySlug = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    // Increment page views in background
    business.views += 1;
    await business.save();

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
