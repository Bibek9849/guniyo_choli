import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Subscription failed. Try again.');
    }
  };

  return (
    <footer className="footer">
      <div className="newsletter-section">
        <h3>Newsletter</h3>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>
        {message && <p className="newsletter-message">{message}</p>}
      </div>
      <div className="footer-links">
        {/* Add other footer links */}
      </div>
      <div className="social-icons">
        {/* Add social icons */}
      </div>
      <div className="footer-bottom">
        <p>© Copyright 2024 - Chinno</p>
      </div>
    </footer>
  );
};

export default Footer;
