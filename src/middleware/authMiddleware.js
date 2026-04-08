const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==============================
// 🔐 PROTECT ROUTES (AUTH)
// ==============================
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 🔥 Extract token from header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // 🔓 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 Get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 📌 Attach to request
    req.user = user;

    next();

  } catch (error) {
    console.error("❌ Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};

// ==============================
// 🛡️ ROLE-BASED ACCESS (ADMIN)
// ==============================
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};