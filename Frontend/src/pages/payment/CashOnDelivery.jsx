import React, { useState } from "react";
import axios from "axios";

const CashOnDelivery = ({ amount, products }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Debug log to see what products look like
      console.log('Products received:', products);

      // Format products data with better error handling
      const formattedProducts = products.map(item => {
        console.log('Processing item:', item); // Debug log

        // Handle different possible product ID structures
        const productId = item.product?._id || item.productId || item.product;
        
        if (!productId) {
          console.error('Invalid product structure:', item);
          throw new Error('Invalid product data');
        }

        return {
          product: productId,
          quantity: item.quantity
        };
      });

      console.log('Formatted products:', formattedProducts);

      const orderData = {
        ...formData,
        amount,
        products: formattedProducts,
        paymentMethod: 'Cash on Delivery',
        status: 'Pending'
      };

      console.log('Sending order data:', orderData);

      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Order response:', response.data);

      if (response.data.success) {
        // Remove any existing localhost message popups
        const existingAlerts = document.querySelectorAll('.success-popup');
        existingAlerts.forEach(alert => alert.remove());

        // Show success popup with homepage button
        const popup = document.createElement('div');
        popup.className = 'success-popup';
        popup.innerHTML = `
          <div class="success-content">
            <div class="success-icon">✓</div>
            <h2 style="font-size: 24px; margin: 15px 0;">Order Created Successfully!</h2>
            <p style="margin-bottom: 20px;">Thank you for your order.</p>
            <button id="goToHome" class="home-button">Go to Homepage</button>
          </div>
        `;
        document.body.appendChild(popup);

        // Add event listener to the button
        document.getElementById('goToHome').addEventListener('click', () => {
          document.body.removeChild(popup);
          window.location.href = '/';
        });

        // Silently clear cart without showing any messages
        try {
          await axios.delete('http://localhost:5000/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      alert(
        error.response?.data?.message || 
        'Failed to create order. Please try again.'
      );
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowForm(true)}
        className="btn-checkout"
      >
        Proceed to Checkout
      </button>

      {showForm && (
        <div className="form-overlay">
          <div className="delivery-form">
            <h3>Delivery Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="address"
                  placeholder="Delivery Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Confirm Order
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CashOnDelivery; 