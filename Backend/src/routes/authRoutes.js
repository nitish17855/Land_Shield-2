const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/google", authController.googleAuth);

// Protected routes
router.get("/me", verifyToken, authController.getMe);

module.exports = router;
