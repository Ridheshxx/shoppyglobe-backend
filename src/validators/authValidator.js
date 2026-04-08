// ==============================
// 🔐 AUTH VALIDATORS (PRO LEVEL)
// ==============================

// 📧 Email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==============================
// 🧠 COMMON VALIDATION HELPER
// ==============================
const sendError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

// ==============================
// ✅ REGISTER VALIDATION
// ==============================
exports.validateRegister = (req, res, next) => {
  let { name, email, password } = req.body;

  // 🔥 Trim inputs
  name = name?.trim();
  email = email?.trim();

  if (!name || !email || !password) {
    return sendError(res, "All fields (name, email, password) are required");
  }

  if (name.length < 2) {
    return sendError(res, "Name must be at least 2 characters");
  }

  if (!emailRegex.test(email)) {
    return sendError(res, "Invalid email format");
  }

  if (password.length < 6) {
    return sendError(res, "Password must be at least 6 characters");
  }

  // 🔥 Optional strong password (bonus 💀)
  /*
  const strongPassword = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!strongPassword.test(password)) {
    return sendError(res, "Password must include uppercase & number");
  }
  */

  next();
};

// ==============================
// ✅ LOGIN VALIDATION
// ==============================
exports.validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  email = email?.trim();

  if (!email || !password) {
    return sendError(res, "Email and password are required");
  }

  if (!emailRegex.test(email)) {
    return sendError(res, "Invalid email format");
  }

  next();
};