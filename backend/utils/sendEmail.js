import nodemailer from 'nodemailer';
import ENV from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: ENV.MAIL_TRAP_HOST,
  port: ENV.MAIL_TRAP_PORT || 587,
  auth: {
    user: ENV.MAIL_TRAP_USERNAME,
    pass: ENV.MAIL_TRAP_PASSWORD,
  },
  secure: false,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Postify" <no-reply@postify.dev>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send email:`, err.message);
  }
};

export default sendEmail;
