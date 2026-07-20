const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user (inactive by default, sends activation link)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} already exists` });
    }

    // User is created with active: false by default
    const user = await User.create({
      username,
      email,
      password,
      active: false,
    });

    // Generate secure token containing the email
    const activationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Construct activation URL
    const activationLink = `${req.protocol}://${req.get('host')}/api/auth/confirm/${activationToken}`;

    // Send email to user
    await sendEmail({
      to: user.email,
      subject: '🎮 Activate Your Gaming Hub Account!',
      text: `Welcome to Gaming Hub, ${user.username}! Please confirm your account by clicking the following link: ${activationLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0b16; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; border: 1px solid #6d28d9;">
          <h2 style="color: #00f5ff; text-align: center;">WELCOME TO THE ARENA!</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>Thank you for registering at Gaming Hub. Your account has been created successfully but needs to be activated before you can log in.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" style="background: linear-gradient(135deg, #6d28d9, #00f5ff); color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">ACTIVATE ACCOUNT</a>
          </p>
          <p style="font-size: 12px; color: #94a3b8;">If you did not request this registration, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #1e1e3a; margin: 20px 0;">
          <p style="text-align: center; font-size: 12px; color: #6d28d9;">Gaming Hub Team &copy; 2026</p>
        </div>
      `,
    });

    res.status(201).json({
      message: 'Registration successful! A confirmation email has been sent. Please activate your account to log in.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user (blocks inactive accounts)
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check account status
    if (user.active === false) {
      return res.status(401).json({
        message: 'Your account is not activated yet. Please click the link sent to your email to activate it.',
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm and activate account
// @route   GET /api/auth/confirm/:token
const confirmAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #050505; color: #fff; min-height: 100vh;">
          <h2 style="color: #ef4444;">Activation Error</h2>
          <p>User not found or account does not exist.</p>
          <a href="/login" style="color: #a78bfa;">Go to Login</a>
        </div>
      `);
    }

    if (user.active) {
      return res.redirect('/login?activated=already');
    }

    user.active = true;
    await user.save();

    res.redirect('/login?activated=true');
  } catch (error) {
    res.status(400).send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #050505; color: #fff; min-height: 100vh;">
        <h2 style="color: #ef4444;">Activation Link Invalid</h2>
        <p>The token is invalid, corrupted, or has expired. Please register again.</p>
        <a href="/login" style="color: #a78bfa;">Go to Login</a>
      </div>
    `);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('cart.productId');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email, role, walletBalance } = req.body;

    user.username = username !== undefined ? username : user.username;
    user.email = email !== undefined ? email : user.email;
    user.role = role !== undefined ? role : user.role;
    if (walletBalance !== undefined) {
      user.walletBalance = Number(walletBalance);
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      walletBalance: updated.walletBalance,
      active: updated.active,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Do not delete self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account!' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  confirmAccount,
  getProfile,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
};
