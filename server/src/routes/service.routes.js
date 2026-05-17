const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices,
} = require("../controllers/service.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Protected routes
router.use(protect); // All routes below are protected

router.post("/", createService);
router.get("/user/me", getMyServices);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
