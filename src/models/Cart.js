const mongoose = require("mongoose");

// ==============================
// 🛒 CART ITEM SCHEMA
// ==============================
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },

    // 🔥 PRICE SNAPSHOT (IMPORTANT 💀)
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// ==============================
// 🛒 CART SCHEMA
// ==============================
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [cartItemSchema],

    totalItems: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
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
// 🔥 CALCULATE TOTALS
// ==============================
cartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  this.totalPrice = this.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
};

// ==============================
// 🔥 PREVENT DUPLICATE PRODUCTS
// ==============================
cartSchema.methods.addOrUpdateItem = function (productId, quantity, price) {
  const index = this.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (index > -1) {
    this.items[index].quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
    });
  }
};

// ==============================
// 🔥 REMOVE ITEM
// ==============================
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
};

// ==============================
// 🔥 AUTO UPDATE TOTALS BEFORE SAVE
// ==============================
cartSchema.pre("save", function (next) {
  this.calculateTotals();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);