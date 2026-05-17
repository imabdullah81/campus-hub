const express = require("express");
const router = express.Router();
const { generateUploadSignature } = require("../utils/cloudinary.utils");
const { protect } = require("../middleware/auth.middleware");

/**
 * @desc    Generate Cloudinary upload signature
 * @route   GET /api/upload/sign
 * @access  Private
 */
router.get("/sign", protect, (req, res) => {
  try {
    const folder = req.query.folder || 'listings';
    const signatureData = generateUploadSignature(folder);
    res.status(200).json({
      success: true,
      ...signatureData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate upload signature",
    });
  }
});

module.exports = router;
