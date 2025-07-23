import React, { useState } from "react";
import "../../CSS/About.css";
import mountainImage from "../../Assets/a.jpg"; 

const About = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleStarClick = (star) => {
    setRating(star);
  };

  const submitReview = () => {
    setMessage("Thank you for your review!");
  };

  return (
    <div className="about-container">
      {/* Left Box */}
      <div className="about-box">
        <h1 className="section-title">Who We Are</h1>
        <p>
        Chinno Ladies Fashion Brand is a leading fashion retailer based in Nepal, dedicated to offering stylish, high-quality, and affordable clothing for women. Our mission is to empower women by providing them with fashionable, versatile, and comfortable clothing that suits every occasion. From casual wear to formal attire, we bring together timeless elegance and contemporary trends, designed to make every woman feel confident and beautiful.
        </p>
        <img src={mountainImage} alt="Mountain Adventure" />
      </div>

      {/* Right Box */}
      <div className="about-box">
        <h1 className="section-title">Why Us</h1>
        <p>
        At Chinno Ladies Fashion Brand, we believe in the power of self-expression through fashion. Our collections are carefully curated to reflect the diverse tastes, personalities, and lifestyles of women in Nepal. We prioritize quality, durability, and ethical production processes, ensuring that every piece is crafted with care and attention to detail. With our easy online shopping experience, dedicated customer service, and prompt delivery, we aim to become the go-to brand for fashionable and affordable women's clothing in Nepal.
        </p>

        {/* Review Box Below */}
        <div className="review-box">
          <h2>Give us a Review</h2>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? "selected" : ""}`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
          <button className="submit-review-btn" onClick={submitReview}>
            Submit Review
          </button>
          {message && <p className="review-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default About;
