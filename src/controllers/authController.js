const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ==============================
// 🔐 GENERATE TOKEN
// ==============================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

// ==============================
// ✅ REGISTER USER
// ==============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 👤 Create user (password auto hashed by model 🔥)
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// ✅ LOGIN USER
// ==============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    // 🔍 Find user (with password)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔐 Compare password (model method 🔥)
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// 👤 GET PROFILE (BONUS 🔥)
// ==============================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("❌ Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};