const mongoose = require("mongoose");

// ==============================
// 🔁 RETRY CONFIG
// ==============================
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 sec

// ==============================
// 🔥 CONNECT DB FUNCTION
// ==============================
const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);

    // 🔁 Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`🔁 Retrying connection... (${retryCount + 1}/${MAX_RETRIES})`);

      setTimeout(() => {
        connectDB(retryCount + 1);
      }, RETRY_DELAY);

    } else {
      console.error("💀 Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

// ==============================
// 📡 MONGOOSE EVENTS
// ==============================
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected");
});

// ==============================
// 🛑 GRACEFUL SHUTDOWN
// ==============================
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Closing MongoDB connection...`);
  await mongoose.connection.close();
  console.log("💀 MongoDB disconnected");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = connectDB;