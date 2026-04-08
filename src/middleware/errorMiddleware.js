// ==============================
// ❌ NOT FOUND MIDDLEWARE
// ==============================
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ==============================
// 💀 GLOBAL ERROR HANDLER
// ==============================
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  // ==============================
  // 🔥 MONGOOSE BAD OBJECT ID
  // ==============================
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // ==============================
  // 🔥 DUPLICATE KEY ERROR
  // ==============================
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}`;
  }

  // ==============================
  // 🔥 VALIDATION ERROR
  // ==============================
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // ==============================
  // 🔥 JWT ERROR
  // ==============================
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // ==============================
  // 📤 FINAL RESPONSE
  // ==============================
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};

module.exports = { notFound, errorHandler };