const sendEmail = require('../utils/email');

// @desc    Receive contact form query & send email alerts
// @route   POST /api/contact
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gaminghub.com';

    // 1. Email to the visitor
    await sendEmail({
      to: email,
      subject: '🎮 We have received your query! — Gaming Hub',
      text: `Hi ${name},\n\nThis email confirms that we have successfully received your query.\n\nYour Message:\n"${message}"\n\nOur admins will check the details and reply shortly.\n\nBest Regards,\nGaming Hub Team`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0b16; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; border: 1px solid #6d28d9;">
          <h3 style="color: #00f5ff; border-bottom: 1px solid #1e1e3a; padding-bottom: 10px; margin-top: 0;">QUEST INITIATED!</h3>
          <p>Hi <strong>${name}</strong>,</p>
          <p>This is to confirm that we have successfully received your contact request.</p>
          <div style="background-color: #0c0c18; border-left: 4px solid #6d28d9; padding: 15px; margin: 15px 0; border-radius: 4px;">
            <p style="margin: 0; color: #94a3b8; font-style: italic;">"${message}"</p>
          </div>
          <p>Our team is currently reviewing your query and will reply as soon as possible.</p>
          <hr style="border: 0; border-top: 1px solid #1e1e3a; margin: 20px 0;">
          <p style="text-align: center; font-size: 11px; color: #6d28d9;">Gaming Hub &copy; 2026</p>
        </div>
      `,
    });

    // 2. Email to the admin
    await sendEmail({
      to: adminEmail,
      subject: '⚠️ New Contact Form Submission — Gaming Hub',
      text: `Alert: New query submitted.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0b16; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; border: 1px solid #ef4444;">
          <h3 style="color: #ef4444; border-bottom: 1px solid #1e1e3a; padding-bottom: 10px; margin-top: 0;">NEW VISITOR QUERY</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #94a3b8; width: 100px;">Name:</td>
              <td style="padding: 6px 0; color: #fff;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #94a3b8;">Email:</td>
              <td style="padding: 6px 0; color: #fff;"><a href="mailto:${email}" style="color: #00f5ff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #94a3b8; vertical-align: top;">Message:</td>
              <td style="padding: 6px 0; color: #fff; background-color: #0c0c18; padding: 10px; border-radius: 4px;">${message}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #1e1e3a; margin: 20px 0;">
          <p style="text-align: center; font-size: 11px; color: #ef4444;">Gaming Hub Notifications</p>
        </div>
      `,
    });

    res.json({ message: 'Your message has been sent successfully. Please check your email for confirmation.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContactForm };
