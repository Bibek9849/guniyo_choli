import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/ProductCard.css';

const ProductCard = ({ productInformation, color }) => {
  const { _id, productCategory, productImage, productName, productPrice, productDescription } = productInformation;

  return (
    <div className="product-card">
      <span
        className="product-badge"
        style={{ backgroundColor: color || '#f00' }}
      >
        {productCategory}
      </span>

      <img
        src={`http://localhost:5000/products/${productImage}`}
        alt={productName}
        className="product-image"
      />

      <div className="product-content">
        <div className="product-header">
          <h4 className="product-title">{productName}</h4>
          <span className="product-price">Rs. {productPrice}</span>
        </div>
        <p className="product-description">
          {productDescription.length > 40
            ? productDescription.slice(0, 40) + '...'
            : productDescription}
        </p>
        <Link to={`/buynow/${_id}`} className="buy-now-btn">
          Buy Now
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
