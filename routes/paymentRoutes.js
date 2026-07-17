const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { validateOrder } = require('../middleware/validationMiddleware');

router.post('/checkout', protect, validateOrder, checkout);

module.exports = router;
