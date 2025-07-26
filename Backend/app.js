const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log('\n--- Incoming Request ---');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('----------------------\n');
  next();
});

// Mount routes with explicit console    log
console.log('Mounting routes...');

app.use('/api/orders', (req, res, next) => {
  console.log('Order route hit:', req.method, req.url);
  next();
}, orderRoutes);

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling at middleware
app.use((err, req, res, next) => {
  console.error('Error in middleware:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

// 404 handler 
app.use((req, res) => {
  console.log('404 Error:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });
  res.status(404).json({
    success: false,
    message: `API Endpoint Not Found: ${req.method} ${req.url}`
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`\nServer running on port ${PORT}`);
      console.log('\nRegistered Routes:');
      console.log('- POST /api/orders (Create Order)');
      console.log('- GET /api/orders/user/:userId (Get User Orders)');
      console.log('- GET /api/test (Test Route)');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

module.exports = app; 