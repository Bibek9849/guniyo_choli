const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Import cart controllers
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

// Cart route
router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.put("/:itemId", verifyToken, updateCartItem);
router.delete("/:itemId", verifyToken, removeFromCart);
router.delete("/", verifyToken, clearCart);

module.exports = router; 