const User = require("../models/User");
const { verifyToken } = require("../utils/jwt.utils");

/**
 * protect
 * Middleware that verifies the JWT from the HttpOnly cookie.
 * Attaches the decoded user payload to req.user.
 * Returns 401 if missing, invalid, or expired.
 */
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.campus_hub_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid. Please log in again.",
      });
    }

    // Verify the user still exists and is active
    const user = await User.findById(decoded.id).select("_id role isActive");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // Attach minimal user info to request
    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * authorize(...roles)
 * Factory that returns a middleware enforcing role-based access.
 * Must be used AFTER the protect middleware.
 *
 * @param {...string} roles - allowed roles (e.g. 'admin', 'student')
 *
 * @example
 * router.get('/admin-only', protect, authorize('admin'), handler);
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of: [${roles.join(", ")}].`,
      });
    }
    next();
  };
};
