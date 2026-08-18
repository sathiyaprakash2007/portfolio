const nodemailer = require("nodemailer");

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },

  // LOCAL DEVELOPMENT ONLY
  tls: {
    rejectUnauthorized: false,
  },
});

// ==========================================
// VERIFY EMAIL CONNECTION
// ==========================================

const verifyMailer = async () => {
  try {
    await transporter.verify();

    console.log(
      "✅ Email service connected successfully!"
    );
  } catch (error) {
    console.error(
      "❌ Email service connection failed:",
      error.message
    );
  }
};

module.exports = {
  transporter,
  verifyMailer,
};