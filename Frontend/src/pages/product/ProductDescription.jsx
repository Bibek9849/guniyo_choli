import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../CSS/ProductDescription.css";

const ProductDescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <p>No product selected.</p>;
  }

  const handleProceedToCheckout = () => {
    const totalPrice = product.productPrice * quantity;
    navigate("/payment", { state: { product, action: "buy", totalPrice, cartItems: [{ product, quantity }], total: totalPrice } });
  };

  return (
    <div className="product-description-container">
      <div className="product-description-wrapper">
        {/* Product Image */}
        <div className="product-image">
          <img
            src={`http://localhost:5000/products/${product.productImage}`}
            alt={product.productName}
          />
        </div>

        {/* Product Information */}
        <div className="product-info">
          <h1 className="product-name">{product.productName}</h1>
          <p className="product-description">{product.productDescription}</p>
          <div className="product-rating">
            <span>⭐ 4.9</span>
            <span>Sold: 125</span>
          </div>
          <div className="product-stock-info">
            <span>✅ In Stock</span>
            <span>✔ Guaranteed</span>
            <span>🚚 Free Delivery</span>
          </div>
          <div className="product-details">
            <p><strong>Brand:</strong> {product.productBrand}</p>
          </div>
          <div className="product-pricing">
            <p>Price per Unit: Rs. {product.productPrice}</p>
            <div className="quantity-select">
              <label htmlFor="quantity-select">Quantity:</label>
              <select
                id="quantity-select"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="total-price">Total Price: Rs. {product.productPrice * quantity}</p>
          <button className="proceed-btn" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
