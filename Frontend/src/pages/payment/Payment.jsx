import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CashOnDelivery from './CashOnDelivery';
import './Payment.css';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [token, navigate]);

  const fetchCartItems = async () => {
    try {
      // First try to get data from location state
      if (location.state?.cartItems && location.state?.total) {
        setProducts(location.state.cartItems);
        setAmount(location.state.total);
        setLoading(false);
        return;
      }

      // If no location state, fetch from API
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Cart Response:', response.data); // For debugging

      if (response.data && response.data.items) {
        const cartItems = response.data.items.map(item => ({
          productId: item.product?._id,
          product: item.product,
          quantity: item.quantity
        }));
        setProducts(cartItems);
        
        // Calculate total from cart items
        const total = cartItems.reduce((sum, item) => {
          const price = item.product?.price || 0;
          const quantity = item.quantity || 0;
          return sum + (price * quantity);
        }, 0);

        console.log('Cart Items:', cartItems); // Debug log
        console.log('Calculated Total:', total); // Debug log
        setAmount(total);
      } else {
        throw new Error('No items found in cart');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Unable to load cart items. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-wrapper">
        <div className="loading">Loading payment details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-wrapper">
        <div className="payment-container">
          <div className="error-message">
            {error}
            <button onClick={() => navigate('/cart')} className="btn-cancel mt-4">
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="payment-wrapper">
        <div className="payment-container">
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn-cancel">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-wrapper">
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-header">
            <h2>Order Summary</h2>
          </div>

          <div className="order-summary">
            <div className="cart-items-summary">
              {products.map((item, index) => (
                <div key={item._id || index} className="cart-item">
                  <div className="item-details">
                    <span>{item.product?.name}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Rs. {(item.product?.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-details">
              <div className="price-row items">
                <span>Items ({products.length}):</span>
                <span>Rs. {Number(amount).toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Shipping Fee:</span>
                <span>Free</span>
              </div>
              <div className="price-row discount">
                <span>Discount:</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="price-row total">
                <span>Total Amount:</span>
                <span>Rs. {Number(amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="payment-actions">
            <CashOnDelivery amount={amount} products={products} />
            <button
              onClick={() => navigate('/cart')}
              className="btn-cancel"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
