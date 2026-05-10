const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_COOKIE_EXPIRES_IN = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "7", 10);

/**
 * Generate a signed JWT for a user.
 * @param {string} userId
 * @param {string} role
 * @returns {string} signed JWT
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT and return the decoded payload.
 * Throws if invalid or expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Attach JWT as an HttpOnly cookie on the response and return it.
 * @param {object} res   - Express response object
 * @param {string} token - signed JWT
 */
const attachCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,                              // not accessible via JS
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  };

  res.cookie("campus_hub_token", token, cookieOptions);
};

/**
 * Clear the auth cookie (logout).
 * @param {object} res - Express response object
 */
const clearCookie = (res) => {
  res.cookie("campus_hub_token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

module.exports = { generateToken, verifyToken, attachCookie, clearCookie };
