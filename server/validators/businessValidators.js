const { body } = require('express-validator');

exports.createBusinessValidator = [
  body('businessName')
    .trim()
    .notEmpty().withMessage('Business Name is required')
    .isLength({ min: 2 }).withMessage('Business Name must be at least 2 characters long')
    .escape(),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['hotel', 'restaurant', 'sweet-shop', 'salon', 'gym']).withMessage('Invalid business category selected'),
  body('address')
    .trim()
    .notEmpty().withMessage('Business Address is required')
    .escape(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 7 }).withMessage('Please enter a valid phone number')
    .escape(),
  body('whatsapp')
    .trim()
    .notEmpty().withMessage('WhatsApp support number is required')
    .isNumeric().withMessage('WhatsApp number must contain only numeric characters (with country code, e.g. 919876543210)'),
  body('template')
    .optional()
    .trim()
    .isIn(['modern', 'classic', 'minimalist']).withMessage('Invalid design template selected'),
  body('description')
    .optional()
    .trim()
    .escape()
];
