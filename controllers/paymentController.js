const User = require('../models/User');
const Order = require('../models/Order');
const sendEmail = require('../utils/email');

// @desc    Process checkout and store order
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

    // Calculate order total and list items
    let orderTotal = 0;
    const orderItems = [];

    for (const item of user.cart) {
      if (!item.productId) continue;
      const subtotal = item.productId.price * item.quantity;
      orderTotal += subtotal;
      orderItems.push({
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'Cart contains invalid products' });
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

    const orderId = `ORD-${Date.now()}`;

    // Create and save the order in database
    const order = await Order.create({
      orderId,
      user: user._id,
      username: user.username,
      items: orderItems,
      total: orderTotal,
      paymentMethod,
      address,
      status: 'Pending',
    });

    // Clear user cart
    user.cart = [];
    await user.save();

    // Trigger Nodemailer Emails
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gaminghub.com';

    // 1. Send receipt confirmation email to Customer
    const itemsListHtml = orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #1e1e3a;">${item.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #1e1e3a; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #1e1e3a; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #1e1e3a; text-align: right;">$${item.subtotal.toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    await sendEmail({
      to: user.email,
      subject: ` Order Confirmed! Receipt — ${orderId}`,
      text: `Hi ${user.username},\n\nYour order has been successfully placed!\n\nOrder ID: ${orderId}\nTotal: $${orderTotal.toFixed(2)}\nShipping Address: ${address}\n\nThank you for shopping at Gaming Hub!`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0b16; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; border: 1px solid #6d28d9;">
          <h2 style="color: #00f5ff; text-align: center; margin-top: 0;">ORDER CONFIRMED!</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>Your order has been placed successfully and is now being processed.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #1e1e3a;">
                <th style="padding: 8px; text-align: left; color: #a78bfa;">Item</th>
                <th style="padding: 8px; text-align: center; color: #a78bfa;">Qty</th>
                <th style="padding: 8px; text-align: right; color: #a78bfa;">Price</th>
                <th style="padding: 8px; text-align: right; color: #a78bfa;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px 8px; text-align: right; font-weight: bold; color: #cbd5e1;">Grand Total:</td>
                <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #edff66; font-size: 16px;">$${orderTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #0c0c18; padding: 15px; border-radius: 6px; border: 1px solid #1e1e3a; margin-top: 20px;">
            <p style="margin: 0 0 5px 0; color: #a78bfa; font-weight: bold;">Shipping Details:</p>
            <p style="margin: 0; color: #cbd5e1; font-size: 14px;">${address}</p>
            <p style="margin: 10px 0 0 0; color: #a78bfa; font-weight: bold;">Payment Method:</p>
            <p style="margin: 0; color: #cbd5e1; font-size: 14px; text-transform: uppercase;">${paymentMethod}</p>
          </div>

          <p style="margin-top: 20px; font-size: 14px;">We'll notify you as soon as your loot is dispatched!</p>
          <hr style="border: 0; border-top: 1px solid #1e1e3a; margin: 20px 0;">
          <p style="text-align: center; font-size: 12px; color: #6d28d9;">Gaming Hub Shop &copy; 2026</p>
        </div>
      `,
    });

    // 2. Send notification email to Admin
    await sendEmail({
      to: adminEmail,
      subject: ` New Order Placed: ${orderId} — Gaming Hub`,
      text: `Alert: User ${user.username} placed a new order ${orderId} for $${orderTotal.toFixed(2)}.`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0b16; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; border: 1px solid #00f5ff;">
          <h3 style="color: #00f5ff; border-bottom: 1px solid #1e1e3a; padding-bottom: 10px; margin-top: 0;">NEW CUSTOMER TRANSACTION</h3>
          <p>An order has been placed by user <strong>${user.username}</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #94a3b8; width: 120px;">Order ID:</td>
              <td style="padding: 6px 0; color: #fff;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #94a3b8;">Total Revenue:</td>
              <td style="padding: 6px 0; color: #edff66; font-weight: bold;">$${orderTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #94a3b8;">Method:</td>
              <td style="padding: 6px 0; color: #fff; text-transform: uppercase;">${paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #94a3b8; vertical-align: top;">Shipping To:</td>
              <td style="padding: 6px 0; color: #fff;">${address}</td>
            </tr>
          </table>

          <p style="text-align: center; margin: 25px 0 0 0;">
            <a href="${req.protocol}://${req.get('host')}/admin.html" style="background-color: #6d28d9; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">GO TO ADMIN DASHBOARD</a>
          </p>
        </div>
      `,
    });

    // Emit Socket.io event for live order notification
    const io = req.app.get('io');
    if (io) {
      io.emit('orderUpdate', {
        message: ` New order placed by ${user.username}!`,
        orderId,
        total: orderTotal,
        itemCount: orderItems.length,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      message: 'Order placed successfully!',
      order,
      newWalletBalance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkout };
