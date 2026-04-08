// ==============================
// 🔐 LOAD ENV FIRST (IMPORTANT 💀)
// ==============================
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

// ==============================
// 🚀 START SERVER FUNCTION
// ==============================
const startServer = async () => {
  try {
    // 🗄️ Connect DB first
    await connectDB();

    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });

    // ==============================
    // 💀 UNHANDLED PROMISE REJECTION
    // ==============================
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Promise Rejection:", err.message);

      server.close(() => {
        process.exit(1);
      });
    });

    // ==============================
    // 💀 UNCAUGHT EXCEPTION
    // ==============================
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err.message);
      process.exit(1);
    });

    // ==============================
    // 🛑 GRACEFUL SHUTDOWN
    // ==============================
    const shutdown = (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down...`);

      server.close(() => {
        console.log("💀 Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("❌ Server Startup Error:", error.message);
    process.exit(1);
  }
};

// ==============================
// 🚀 RUN APP
// ==============================
startServer();