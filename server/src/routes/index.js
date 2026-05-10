const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");

// ─── Mount sub-routers ────────────────────────────────────────────────────────
router.use("/auth", authRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
router.get("/status", (req, res) => {
  res.json({ status: "API is running", timestamp: new Date().toISOString() });
});

module.exports = router;
