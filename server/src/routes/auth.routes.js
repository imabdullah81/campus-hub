const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleAuth,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

// ─── Public routes ────────────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ─── Protected routes ─────────────────────────────────────────────────────────
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
