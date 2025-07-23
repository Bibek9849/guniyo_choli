import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../CSS/RentProductDescription.css";

const RentProductDescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [days, setDays] = useState(1); // Default to 1 day
  const rentPricePerDay = 200;

  if (!product) {
    return <p>No product selected for renting.</p>;
  }

  const handleProceedToPayment = () => {
    const totalPrice = rentPricePerDay * days; // Calculate total price
    navigate("/payment", { state: { product, action: "rent", totalPrice, cartItems: [{ product, days }], total: totalPrice } });
  };

  return (
    <div className="rent-product-container">
      <div className="rent-product-wrapper">
        {/* Left Section: Product Image */}
        <div className="rent-product-image">
          <img
            src={`http://localhost:5000/products/${product.productImage}`}
            alt={product.productName}
          />
        </div>

        {/* Right Section: Product Info */}
        <div className="rent-product-info">
          <h1 className="product-name">{product.productName}</h1>
          <p className="product-description">{product.productDescription}</p>
          <p className="rent-price">Rent Price: Rs. {rentPricePerDay} per day</p>

          {/* Dropdown for selecting days */}
          <div className="rent-duration">
            <label htmlFor="days-select">Select Days:</label>
            <select
              id="days-select"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
            >
              {[...Array(30).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1} {day + 1 === 1 ? "Day" : "Days"}
                </option>
              ))}
            </select>
          </div>

          {/* Total Rent Price */}
          <p className="total-price">Total Price: Rs. {rentPricePerDay * days}</p>

          {/* Proceed Button */}
          <button className="proceed-btn" onClick={handleProceedToPayment}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentProductDescription;