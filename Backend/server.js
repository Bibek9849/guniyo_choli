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

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request log
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.url,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Test route to verify API is working
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Mount routes
app.use('/api/orders', orderRoutes);  
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log('404 Error for:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'API Endpoint Not Found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 