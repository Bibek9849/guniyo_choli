const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Create Order Controller
const createOrder = async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    console.log('User from token:', req.user); // Debug log

    const {
      amount,
      products,
      fullName,
      email,
      phone,
      address,
      city
    } = req.body;

    // Validate required fields
    if (!amount || !products || !fullName || !email || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create new order
    const order = new Order({
      user: req.user._id, // Changed from req.user.id to req.user._id
      products: products.map(item => ({
        product: item.product,
        quantity: item.quantity
      })),
      amount,
      fullName,
      email,
      phone,
      address,
      city,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    const savedOrder = await order.save();
    console.log('Order saved:', savedOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get Orders for a User
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};
