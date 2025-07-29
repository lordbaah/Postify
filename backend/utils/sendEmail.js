import nodemailer from 'nodemailer';
import ENV from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: ENV.MAILJET_HOST,
  port: ENV.MAILJET_PORT,
  auth: {
    user: ENV.MAILJET_API_KEY,
    pass: ENV.MAILJET_SECRET_KEY,
  },
  secure: false,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Postify Team" <${ENV.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
    // console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    // console.error(`❌ Failed to send email:`, err.message);
  }
};

export default sendEmail;
