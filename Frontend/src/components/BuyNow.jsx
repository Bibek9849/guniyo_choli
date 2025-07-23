import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios
import "../CSS/BuyNow.css";
import { getSingleProduct } from "../apis/Api";

const BuyNow = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "http://localhost:5000/api/user/add_to_cart",
        {
          userId: user._id,
          productId: id,
          quantity,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data.success) {
        return toast.error("Error while adding to cart");
      }
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const setProduct = async () => {
    const response = await getSingleProduct(id);
    setData(response.data.product);
  };

  useEffect(() => {
    setProduct();
  }, []);

  return (
    <div className="buynow-container">
      <div className="product-wrapper">
        {/* Left Section: Product Image */}
        <div className="product-image-box">
          <img
            src={`http://localhost:5000/products/${data.productImage}`}
            alt={data.productName}
            className="product-image"
          />
        </div>

        {/* Right Section: Product Info */}
        <div className="product-info">
          <h1 className="product-name">{data.productName}</h1>
          <div className="rating">⭐⭐⭐⭐ (150 Reviews) | In Stock</div>
          <p className="price">Price: Rs. {data.productPrice}</p>
          <p className="description">{data.productDescription}</p>

          {/* Quantity Selection */}
          <div className="quantity-selection">
            <label htmlFor="quantity-input">Quantity:</label>
            <input
              id="quantity-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              max="10"
            />
          </div>

          {/* Buy Now Button */}
          <button className="buy-btn" onClick={addToCart}>
            Buy Now
          </button>

          {/* Additional Information */}
          <div className="additional-info">
            <p>Free Delivery</p>
            <p>Free 30 Days Delivery Returns. Details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
