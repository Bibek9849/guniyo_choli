// src/components/Complete.jsx
import React from 'react';
import '../../CSS/Complete.css';
import { Link } from 'react-router-dom';

const Complete = () => {
  const orderDate = localStorage.getItem("orderDate") || new Date().toLocaleDateString();
  
  return (
    <div id="wrapper">
      <div className="cardx">
        <div className="icon">
          {/* Icon can be added here if needed */}
        </div>
        <h1>Your order has been placed!</h1>
        <p>You will receive your order within 3 days.</p>
      </div>
      <div className="cardx">
        <ul>
          <li>
            <span>Products</span>
            <span>{localStorage.getItem("numberOfProduct")}</span>
          </li>
          <li>
            <span>Date</span>
            <span>{orderDate}</span>
          </li>
          <li>
            <span>Total </span>
            <span>{localStorage.getItem("total")}</span>
          </li>
        </ul>
      </div>
      <div className="cardx">
        <div className="cta-row">
          <Link to="/">
            <button className="secondary">Back to dashboard</button>
          </Link>
          <button>Explore More</button>
        </div>
      </div>
    </div>
  );
};

export default Complete;
