// Homepage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../apis/Api";

import Footer from "../../components/Footer";
import "../../CSS/Homepage.css";
import Hero from "../../pages/homepage/Hero";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        const uniqueProducts = res.data.products.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p._id === product._id)
        );
        setProducts(uniqueProducts);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleAction = (product, action) => {
    if (action === "buy") {
      navigate("/product-description", { state: { product, action } });
    } else if (action === "rent") {
      navigate("/rent-product-description", { state: { product } });
    } else if (action === "add-to-cart") {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.productName} added to cart!`);
    }
  };

  return (
    <>
      <div className="homepage">
        <Hero />
        <h2 className="flash-title">Flash Sales</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {product.isOnSale && <div className="sale-badge">Sale</div>}
              <img
                src={`http://localhost:5000/products/${product.productImage}`}
                alt={product.productName}
                className="product-image"
                loading="lazy"
              />
              <h3>{product.productName}</h3>
              <p className="category">{product.category || "General"}</p>
              <p className="price">
                {product.originalPrice && (
                  <span className="original-price">
                    Rs. {product.originalPrice}
                  </span>
                )}
                Rs. {product.productPrice}
              </p>
              <div className="actions">
                <button
                  className="action-btn buy-btn"
                  onClick={() => handleAction(product, "buy")}
                >
                  Buy
                </button>
                <button
                  className="action-btn rent-btn"
                  onClick={() => handleAction(product, "rent")}
                >
                  Rent
                </button>
                <button
                  className="action-btn cart-btn"
                  onClick={() => handleAction(product, "add-to-cart")}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
