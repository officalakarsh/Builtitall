const express = require('express');
const router = express.Router();
const {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  regenerateBusiness
} = require('../controllers/businessController');
const { protect } = require('../middleware/auth');
const { createBusinessValidator } = require('../validators/businessValidators');
const validate = require('../middleware/validate');
const { checkWebsiteLimit } = require('../middleware/limits');

router.use(protect); // Protect all routes under this file

router.route('/')
  .post(checkWebsiteLimit, createBusinessValidator, validate, createBusiness)
  .get(getBusinesses);

router.route('/:id')
  .get(getBusinessById)
  .put(createBusinessValidator, validate, updateBusiness)
  .delete(deleteBusiness);

router.post('/:id/regenerate', regenerateBusiness);

module.exports = router;
