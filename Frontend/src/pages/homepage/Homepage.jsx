import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../apis/Api";
import "../../CSS/Homepage.css";
import Footer from "../../components/Footer";

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
        <div className="hero">
          <div className="hero-text">
            <h1>Welcome to Chinno</h1>
            <p>Your Fashion starts here</p>
          </div>
        </div>
        <h2 className="flash-title">Flash Sales</h2>
        <div className="container mt-3">
          <div className="flash-sale-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={`http://localhost:5000/products/${product.productImage}`}
                  alt={product.productName}
                  className="product-image"
                />
                <h3>{product.productName}</h3>
                <p className="price">Rs. {product.productPrice}</p>
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
                    className="action-btn add-to-cart-btn"
                    onClick={() => handleAction(product, "add-to-cart")}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
