const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ==============================
// 🧠 HELPER: VALIDATE ID
// ==============================
const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ==============================
// ✅ GET USER CART
// ==============================
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });

  } catch (error) {
    console.error("❌ Get Cart Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================
// ✅ ADD TO CART
// ==============================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!isValidId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    // 🆕 Create cart
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // 🔥 Use model method (clean code)
    cart.addOrUpdateItem(productId, quantity, product.price);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });

  } catch (error) {
    console.error("❌ Add To Cart Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================
// ✅ UPDATE CART ITEM
// ==============================
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!isValidId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity required",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });

  } catch (error) {
    console.error("❌ Update Cart Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================
// ✅ REMOVE FROM CART
// ==============================
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!isValidId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // 🔥 Use model method
    cart.removeItem(productId);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: cart,
    });

  } catch (error) {
    console.error("❌ Remove Cart Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================
// ✅ CLEAR CART
// ==============================
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (error) {
    console.error("❌ Clear Cart Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};