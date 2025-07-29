import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import '../CSS/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:5000/api/newsletter/subscribe', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Subscription failed. Try again.');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Newsletter */}
        <div className="newsletter-section">
          <h3>Subscribe to Our Newsletter</h3>
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

        {/* Links */}
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/shop">Shop</a>
          <a href="/contact">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© 2024 Guniyo Choli. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import axios from 'axios';
// import React, { useState } from 'react';
// import '../CSS/Footer.css';

// const Footer = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubscribe = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('https://localhost:5000/api/newsletter/subscribe', { email });
//       setMessage(response.data.message);
//       setEmail('');
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Subscription failed. Try again.');
//     }
//   };

//   return (
//     <footer className="footer">
//       <div className="newsletter-section">
//         <h3>Newsletter</h3>
//         <form className="newsletter-form" onSubmit={handleSubscribe}>
//           <input
//             type="email"
//             placeholder="Your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <button type="submit">
//             <FontAwesomeIcon icon={faArrowRight} />
//           </button>
//         </form>
//         {message && <p className="newsletter-message">{message}</p>}
//       </div>
//       <div className="footer-links">
//         {/* Add other footer links */}
//       </div>
//       <div className="social-icons">
//         {/* Add social icons */}
//       </div>
//       <div className="footer-bottom">
//         <p>© Copyright 2024 - Guniyo Choli</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
