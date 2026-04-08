const express = require("express");
const cors = require("cors");

// 🔥 Import Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

// 🔥 Import Error Middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ==============================
// 🚀 INITIALIZE APP
// ==============================
const app = express();

// ==============================
// 🔧 GLOBAL MIDDLEWARES
// ==============================

// Parse JSON
app.use(express.json({ limit: "10kb" }));

// Enable CORS (customizable)
app.use(
  cors({
    origin: "*", // ⚠️ production me specific domain dena
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 🔥 Simple request logger (bonus)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ==============================
// 🧪 HEALTH CHECK (BONUS 🔥)
// ==============================
app.get("/", (req, res) => {
  res.status(200).send("🔥 ShoppyGlobe API Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server healthy 🚀",
    time: new Date(),
  });
});

// ==============================
// 📦 API ROUTES
// ==============================
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// ==============================
// ❌ ERROR HANDLING (VERY IMPORTANT)
// ==============================
app.use(notFound);
app.use(errorHandler);

// ==============================
// 📤 EXPORT APP
// ==============================
module.exports = app;