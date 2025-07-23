const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { createOrder, getUserOrders } = require("../controllers/orderController");

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Order routes are working' });
});

// Create order
router.post('/', verifyToken, createOrder);

// Get user orders
router.get('/user/:userId', verifyToken, getUserOrders);

module.exports = router;
