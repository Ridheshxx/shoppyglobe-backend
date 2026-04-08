const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// ==============================
// 🛒 CART ROUTES (PROTECTED 🔐)
// ==============================

// 🔍 Get full cart
router.get("/", protect, getCart);

// ➕ Add item to cart
router.post("/", protect, addToCart);

// 🔄 Update item quantity
router.put("/:productId", protect, updateCartItem);

// ❌ Remove single item
router.delete("/:productId", protect, removeFromCart);

// 🧹 Clear entire cart
router.delete("/", protect, clearCart);

module.exports = router;