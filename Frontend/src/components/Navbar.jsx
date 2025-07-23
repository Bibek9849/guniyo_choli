import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cart_icon from "../Assets/cart_icon.png";
import chinno_logo from "../Assets/chinno_logo.jpg";
import "../CSS/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));

    // Retrieve cart items count
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, [location]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const redirectToHome = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="nav-logo" onClick={redirectToHome}>
        <img src={chinno_logo} alt="Chinno Logo" />
      </div>

      <ul className="nav-menu">
        <li className={currentPath === "/" ? "active" : ""}>
          <Link to="/">Shop</Link>
        </li>
        <li className={currentPath === "/about" ? "active" : ""}>
          <Link to="/about">About Us</Link>
        </li>
        <li className={currentPath === "/contact" ? "active" : ""}>
          <Link to="/contact">Contact</Link>
        </li>
        <li className={currentPath === "/admin" ? "active" : ""}>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>

      <div className="nav-icons">
        {user && (
          <Link to="/profile" className="nav-profile">
            <i className="fas fa-user"></i>
          </Link>
        )}
        <Link to="/cart" className="nav-cart">
          <img src={cart_icon} alt="Cart Icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>

      <div className="nav-auth">
        {user ? (
          <>
            <span className="nav-welcome">Welcome {user.firstName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
