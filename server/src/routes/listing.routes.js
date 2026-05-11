const express = require("express");
const router = express.Router();
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
} = require("../controllers/listing.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes
router.get("/", getAllListings);
router.get("/:id", getListingById);

// Protected routes
router.use(protect); // All routes below are protected

router.post("/", createListing);
router.get("/user/me", getMyListings);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

module.exports = router;
