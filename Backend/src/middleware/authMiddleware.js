const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "landshield_default_secret_jwt_2026";

/**
 * Middleware to verify JWT token in Authorization header
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No authentication token provided.",
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      error: "Invalid token format. Format must be 'Bearer <token>'.",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Authentication token has expired. Please sign in again.",
      });
    }
    return res.status(401).json({
      success: false,
      error: "Invalid authentication token.",
    });
  }
}

module.exports = {
  verifyToken,
};
