const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const listingRoutes = require("./listing.routes");
const uploadRoutes = require("./upload.routes");

// ─── Mount sub-routers ────────────────────────────────────────────────────────
router.use("/auth", authRoutes);
router.use("/listings", listingRoutes);
router.use("/upload", uploadRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
router.get("/status", (req, res) => {
  res.json({ status: "API is running", timestamp: new Date().toISOString() });
});

module.exports = router;
