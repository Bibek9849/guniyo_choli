import React from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action === "buy" || action === "rent") {
      navigate("/product-description", { state: { product, action } });
    } else if (action === "add-to-cart") {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.productName} added to cart!`);
    }
  };

  return (
    <div className="product-card">
      <img
        src={`http://localhost:5000/products/${product.productImage}`}
        alt={product.productName}
        className="product-image"
      />
      <h3>{product.productName}</h3>
      <p className="price">Rs. {product.productPrice}</p>
      <div className="product-buttons">
        <button onClick={() => handleAction("buy")} className="buy-btn">
          Buy Now
        </button>
        <button onClick={() => handleAction("rent")} className="rent-btn">
          Rent Now
        </button>
        <button onClick={() => handleAction("add-to-cart")} className="cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
