import React from "react";
import { useLocation } from "react-router-dom";
import "../../CSS/Checkout.css";
import Footer from "../../components/Footer";

const Checkout = () => {
  const location = useLocation();
  const { cartItems } = location.state || {};

  const total = cartItems.reduce((sum, item) => sum + item.productPrice, 0);

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            <img
              src={`http://localhost:5000/products/${item.productImage}`}
              alt={item.productName}
            />
            <span>{item.productName}</span>
            <span>Rs. {item.productPrice}</span>
          </li>
        ))}
      </ul>
      <h2>Total: Rs. {total}</h2>
      <button className="place-order-btn">Place Order</button>
      <Footer />
    </div>
  );
};

export default Checkout;
