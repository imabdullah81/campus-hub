const nodemailer = require("nodemailer");

/**
 * Create a reusable Nodemailer transporter.
 * Reads credentials from environment variables.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_PORT === "465", // true only for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send a password reset email.
 * @param {string} toEmail      - recipient email address
 * @param {string} resetToken   - the plain-text reset token
 * @param {string} fullName     - recipient's full name (for personalisation)
 */
const sendPasswordResetEmail = async (toEmail, resetToken, fullName) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Password – CampusHub</title>
      <style>
        body { margin: 0; padding: 0; background-color: #10131a; font-family: Inter, Arial, sans-serif; }
        .wrapper { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
        .card {
          background: rgba(29, 32, 39, 0.95);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 40px;
        }
        .logo { font-size: 22px; font-weight: 700; color: #adc6ff; margin-bottom: 32px; }
        h1 { font-size: 24px; font-weight: 600; color: #e1e2ec; margin: 0 0 12px; }
        p  { font-size: 15px; color: #c2c6d6; line-height: 1.65; margin: 0 0 20px; }
        .btn {
          display: inline-block;
          background: #3b82f6;
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 10px;
          margin-bottom: 28px;
        }
        .note { font-size: 13px; color: #8c909f; }
        .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #424754; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="card">
          <div class="logo">🎓 CampusHub</div>
          <h1>Reset your password</h1>
          <p>Hi ${fullName},</p>
          <p>
            We received a request to reset the password for your CampusHub account.
            Click the button below to choose a new password. This link is valid for
            <strong style="color:#adc6ff">15 minutes</strong>.
          </p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p class="note">
            If the button above doesn't work, copy and paste this URL into your browser:<br/>
            <span style="color:#3b82f6">${resetUrl}</span>
          </p>
          <p class="note">
            If you didn't request a password reset, you can safely ignore this email.
            Your password won't change.
          </p>
        </div>
        <div class="footer">© ${new Date().getFullYear()} CampusHub Inc. Built for Students.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Reset your CampusHub password",
    html,
  });
};

module.exports = { sendPasswordResetEmail };
