const jwt = require("jsonwebtoken");

// ==============================
// 🎟️ GENERATE JWT TOKEN
// ==============================
const generateToken = (payload, options = {}) => {
  try {
    // 🔥 Validate payload
    if (!payload || typeof payload !== "object") {
      throw new Error("Payload must be an object");
    }

    // 🔥 Secret check (IMPORTANT 💀)
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    // ⏳ Expiry (override possible)
    const expiresIn = options.expiresIn || process.env.JWT_EXPIRE || "7d";

    // 🎟️ Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
    });

    return token;

  } catch (error) {
    console.error("❌ Token Generation Error:", error.message);

    throw new Error("Token generation failed");
  }
};

module.exports = generateToken;