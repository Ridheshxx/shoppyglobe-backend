const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile, // 🔥 BONUS
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ==============================
// 🔐 AUTH ROUTES
// ==============================

// 🆕 Register User
router.post("/register", registerUser);

// 🔓 Login User
router.post("/login", loginUser);

// 👤 Get Profile (Protected 🔥)
router.get("/profile", protect, getProfile);

module.exports = router;