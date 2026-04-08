const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

// ==============================
// 📦 PRODUCT ROUTES
// ==============================

// 🔓 PUBLIC ROUTES
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔐 PROTECTED ROUTES (NO ADMIN 🔥)
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;