const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { generateToken, attachCookie, clearCookie } = require("../utils/jwt.utils");
const { sendPasswordResetEmail } = require("../utils/email.utils");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Helper ───────────────────────────────────────────────────────────────────
/**
 * Generates a JWT, attaches it as an HttpOnly cookie,
 * and returns the sanitized user in the response.
 */
const sendTokenResponse = (res, statusCode, user) => {
  const token = generateToken(user._id, user.role);
  attachCookie(res, token);

  res.status(statusCode).json({
    success: true,
    user,
  });
};

// ─── @POST /api/auth/register ─────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email and password." });
    }

    // Prevent clients from self-assigning admin role
    const safeRole = role === "admin" ? "student" : role || "student";

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const user = await User.create({ fullName, email, password, role: safeRole });

    sendTokenResponse(res, 201, user);
  } catch (error) {
    if (typeof next === "function") next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @POST /api/auth/login ────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    // Explicitly select password (select: false in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated. Please contact support." });
    }

    sendTokenResponse(res, 200, user);
  } catch (error) {
    if (typeof next === "function") next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @POST /api/auth/google ───────────────────────────────────────────────────
exports.googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required." });
    }

    // Verify the ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name: fullName, picture: profileImage } = payload;

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (user) {
      // Link googleId if they previously registered with email/password
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.profileImage) user.profileImage = profileImage;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // New user via Google — create account
      user = await User.create({
        fullName,
        email: email.toLowerCase(),
        googleId,
        profileImage,
        isVerified: true, // Google verifies emails
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated. Please contact support." });
    }

    sendTokenResponse(res, 200, user);
  } catch (error) {
    if (typeof next === "function") next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @POST /api/auth/logout ───────────────────────────────────────────────────
exports.logout = (req, res) => {
  clearCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

// ─── @GET /api/auth/me ────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (typeof next === "function") next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @POST /api/auth/forgot-password ─────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide your email address." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return 200 to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Generate a secure random token (plain), store its hash
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.fullName);
    } catch (emailError) {
      // Roll back token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: "Failed to send reset email. Please try again later." });
    }

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    if (typeof next === "function") next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @POST /api/auth/reset-password ──────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and new password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    // Hash the incoming token and compare
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Reset token is invalid or has expired." });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendTokenResponse(res, 200, user);
  } catch (error) {
    if (typeof next === "function") next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};
