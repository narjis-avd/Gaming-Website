const { body, validationResult } = require('express-validator');

// Helper to run validations and handle validation results
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const messages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      message: messages.join('. '),
      errors: errors.array(),
    });
  };
};

// User Registration Validation
const validateRegister = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]);

// User Login Validation
const validateLogin = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]);

// Contact Form Validation
const validateContact = validate([
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long'),
]);

// Product CRUD Validation (Create / Update)
const validateProduct = validate([
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Peripherals', 'Hardware', 'Displays', 'Audio', 'Consoles'])
    .withMessage('Category must be one of: Peripherals, Hardware, Displays, Audio, Consoles'),
  body('description')
    .optional()
    .trim(),
  body('image')
    .optional()
    .trim(),
]);

// Order Placement Validation
const validateOrder = validate([
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['wallet', 'bank'])
    .withMessage('Payment method must be "wallet" or "bank"'),
  body('bankDetails')
    .optional()
    .custom((value, { req }) => {
      if (req.body.paymentMethod === 'bank') {
        if (!value || !value.cardNumber || !value.expiry || !value.cvv) {
          throw new Error('Bank details (cardNumber, expiry, cvv) are required for bank payment');
        }
        if (value.cardNumber.replace(/\s/g, '').length < 13) {
          throw new Error('Invalid bank card number (must be at least 13 digits)');
        }
      }
      return true;
    }),
]);

module.exports = {
  validateRegister,
  validateLogin,
  validateContact,
  validateProduct,
  validateOrder,
};
