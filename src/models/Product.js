const mongoose = require("mongoose");

// ==============================
// 📦 PRODUCT SCHEMA
// ==============================
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description too long"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      set: (val) => Math.round(val * 100) / 100, // 🔥 price precision
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ==============================
// 🔥 CREATE SLUG BEFORE SAVE
// ==============================
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

// ==============================
// 🔍 INDEXES (ADVANCED 🔥)
// ==============================

// Text search
productSchema.index({ name: "text", description: "text" });

// Featured products
productSchema.index({ isFeatured: 1 });

// ==============================
// 📊 VIRTUAL FIELD (BONUS 🔥)
// ==============================
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

module.exports = mongoose.model("Product", productSchema);