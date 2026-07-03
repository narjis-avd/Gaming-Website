const User = require('../models/User');

// @desc    Process checkout
// @route   POST /api/payment/checkout
const checkout = async (req, res) => {
  try {
    const { address, paymentMethod, bankDetails } = req.body;

    // Validate required fields
    if (!address || !paymentMethod) {
      return res.status(400).json({ message: 'Address and payment method are required' });
    }

    if (!['wallet', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Payment method must be "wallet" or "bank"' });
    }

    // Get user with populated cart
    const user = await User.findById(req.user._id).populate('cart.productId');

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate order total
    let orderTotal = 0;
    const orderItems = [];

    for (const item of user.cart) {
      if (!item.productId) continue;
      const subtotal = item.productId.price * item.quantity;
      orderTotal += subtotal;
      orderItems.push({
        title: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    // Process payment based on method
    if (paymentMethod === 'wallet') {
      if (user.walletBalance < orderTotal) {
        return res.status(400).json({
          message: `Insufficient wallet balance. You have $${user.walletBalance.toFixed(2)} but the order total is $${orderTotal.toFixed(2)}`,
        });
      }

      // Deduct from wallet
      user.walletBalance -= orderTotal;
    } else if (paymentMethod === 'bank') {
      // Validate bank details
      if (!bankDetails || !bankDetails.cardNumber || !bankDetails.expiry || !bankDetails.cvv) {
        return res.status(400).json({
          message: 'Bank payment requires cardNumber, expiry, and cvv',
        });
      }

      // Simulate bank validation
      if (bankDetails.cardNumber.length < 13) {
        return res.status(400).json({ message: 'Invalid card number' });
      }
    }

    // Clear cart
    user.cart = [];
    await user.save();

    // Build order confirmation
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      user: user.username,
      items: orderItems,
      total: orderTotal,
      paymentMethod,
      address,
      timestamp: new Date().toISOString(),
    };

    // Emit Socket.io event for live order notification
    const io = req.app.get('io');
    if (io) {
      io.emit('orderUpdate', {
        message: `🎮 New order placed by ${user.username}!`,
        orderId: orderData.orderId,
        total: orderTotal,
        itemCount: orderItems.length,
        timestamp: orderData.timestamp,
      });
    }

    res.json({
      message: 'Order placed successfully!',
      order: orderData,
      newWalletBalance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkout };
