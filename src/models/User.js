const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ==============================
// 👤 USER SCHEMA
// ==============================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // 🔥 fast queries
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // 🔥 hidden by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // 🔥 never expose password
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ==============================
// 🔐 HASH PASSWORD BEFORE SAVE
// ==============================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12); // 🔥 stronger hashing
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ==============================
// 🔑 COMPARE PASSWORD METHOD
// ==============================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==============================
// 🔍 STATIC METHOD (BONUS 🔥)
// ==============================
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select("+password");
};

module.exports = mongoose.model("User", userSchema);