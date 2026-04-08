const Product = require("../models/Product");

// ==============================
// 🧠 HELPER: VALIDATE OBJECT ID
// ==============================
const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ==============================
// 🧠 HELPER: BUILD QUERY
// ==============================
const buildQuery = (queryParams) => {
  const { keyword, category, minPrice, maxPrice } = queryParams;

  let query = {};

  // 🔍 Search (text index used 🔥)
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // 📂 Category filter
  if (category) {
    query.category = category;
  }

  // 💰 Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  return query;
};

// ==============================
// ✅ GET ALL PRODUCTS
// ==============================
exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const query = buildQuery(req.query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });

  } catch (error) {
    console.error("❌ Get Products Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// ✅ GET SINGLE PRODUCT
// ==============================
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("❌ Get Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// ✅ CREATE PRODUCT
// ==============================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    console.error("❌ Create Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// ✅ UPDATE PRODUCT
// ==============================
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    console.error("❌ Update Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// ✅ DELETE PRODUCT
// ==============================
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};