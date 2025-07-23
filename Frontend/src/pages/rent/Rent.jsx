import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../CSS/Rent.css"; //css of rent
import { getSingleProduct } from "../apis/Api";

const Rent = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [days, setDays] = useState(1); // Rental days (default 1)
  const [totalPrice, setTotalPrice] = useState(0);

  const rentProduct = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "http://localhost:5000/api/user/rent_product",
        {
          userId: user._id,
          productId: id,
          days,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data.success) {
        return toast.error("Error while renting");
      }
      toast.success("Product rented successfully!");
    } catch (error) {
      return toast.error("Something went wrong. Please try again.");
    }
  };

  const setProduct = async () => {
    const response = await getSingleProduct(id);
    setData(response.data.product);
    calculatePrice(response.data.product.productPrice);
  };

  const calculatePrice = (basePrice) => {
    const rentPrice = basePrice / 10; // 10% of the base price per day
    setTotalPrice(rentPrice * days);
  };

  useEffect(() => {
    setProduct();
  }, []);

  useEffect(() => {
    if (data.productPrice) calculatePrice(data.productPrice);
  }, [days]);

  return (
    <div className="rent-container">
      <div className="breadcrumb">
        Account / Trekking / {data.productName} (Rental)
      </div>
      <div className="product-section">
        <img
          src={`http://localhost:5000/products/${data.productImage}`}
          alt={data.productName}
          className="main-image"
        />
        <div className="details">
          <h1 className="title">{data.productName}</h1>
          <div className="rating">⭐⭐⭐⭐ (150 Reviews) | Available for Rent</div>
          <div className="price">
            Base Rent: Rs. {data.productPrice / 10} per day
          </div>
          <p className="description">{data.productDescription}</p>
          <div className="quantity">
            <span>Days:</span>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              min="1"
              max="30"
              className="days-input"
            />
          </div>
          <div className="total-price">Total Price: Rs. {totalPrice}</div>
          <button className="rent-button" onClick={rentProduct}>
            Rent Now
          </button>
          <div className="additional-info">
            <div>Free Delivery</div>
            <div>Flexible Return Policy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rent;
