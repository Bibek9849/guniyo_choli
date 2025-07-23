const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./database/database"); // Database connection file
const newsletterRoutes = require("./routes/newsletterRoutes");
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Load environment variable
dotenv.config();

// Connect to MongoDB
connectDB();

// Create an express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(fileUpload()); // Enable file uploads
app.use(express.urlencoded({ extended: true }));

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:3000"]; // Replace with your frontend URL
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, tokens)
};

// Use CORS middleware
app.use(cors(corsOptions));

// Serve static files
app.use(express.static("./public"));

// Define the port
const PORT = process.env.PORT || 5000;

// Test route
app.get("/test", (req, res) => {
  res.send("Test API is working ...!");
});

// Import routes
const contactRoutes = require("./routes/contactRoutes"); // Contact routes for the contact form
const reviewRoutes = require("./routes/reviewRoutes");

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/contact", contactRoutes); // Contact routes
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Endpoint Not Found",
  });
});

// Start the server
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server-app is running on port', PORT);
      console.log('Connected to local MongoDB');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app;
