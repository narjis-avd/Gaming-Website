const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  let transporter;

  // Check if SMTP settings are configured in .env
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback: Dynamically generate an Ethereal test account
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('💡 Using dynamically generated Ethereal SMTP test account.');
    } catch (err) {
      console.error('❌ Failed to create Nodemailer test account, using mock transporter:', err.message);
      // Fallback fallback: a dummy silent transporter
      transporter = {
        sendMail: async (options) => {
          console.log('📭 [Mock Email Sent] To:', options.to, 'Subject:', options.subject);
          return { messageId: 'mock-id' };
        }
      };
    }
  }

  const mailOptions = {
    from: `"Gaming Hub" <${process.env.SMTP_USER || 'no-reply@gaminghub.com'}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️ Email sent successfully! MessageID: ${info.messageId}`);
  
  // If using Ethereal, log the preview URL so the developer can click it and view the actual email.
  if (nodemailer.getTestMessageUrl) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`✉️ Preview URL: ${previewUrl}`);
    }
  }
  return info;
};

module.exports = sendEmail;
