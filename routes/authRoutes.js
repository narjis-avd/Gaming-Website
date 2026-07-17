const express = require('express');
const router = express.Router();
const {
  register,
  login,
  confirmAccount,
  getProfile,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

// Public auth routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/confirm/:token', confirmAccount);

// Protected user routes
router.get('/profile', protect, getProfile);

// Admin-only User CRUD routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id', protect, adminOnly, updateUserByAdmin);
router.delete('/users/:id', protect, adminOnly, deleteUserByAdmin);

module.exports = router;
