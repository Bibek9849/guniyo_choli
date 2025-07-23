import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import Register from "./pages/register/Register";
import Navbar from "./components/Navbar";
import ProductDescription from "./pages/product/ProductDescription";
import RentProductDescription from "./pages/rent/RentProductDescription"; // Import RentProduct Description
import About from "./pages/navbar/About";
import Payment from "./pages/payment/Payment";


// Toast Config
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpdate from "./pages/admin/AdminUpdate";
import AdminRoutes from "./protected_routes/AdminRoutes";
import Profile from "./pages/profile/Profile";
import UserRoutes from "./protected_routes/UserRoutes";
import ForgotPassword from "./pages/forgot_password/ForgotPassword";
import Sidebar from "./pages/Sidebar/Sidebar";
import BuyNow from "./components/BuyNow";
import Contact from "./pages/navbar/Contact";
import Checkout from "./pages/navbar/Checkout";
import Cart from "./pages/Cart/Cart";
import Complete from "./pages/Cart/Complete";
import Settings from "./pages/setting/Settings";

import EsewaPayment from "./pages/payment/Esewa";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/esewa" element={<EsewaPayment />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/product-description" element={<ProductDescription />} />
        <Route
          path="/rent-product-description"
          element={<RentProductDescription />}
        />
        <Route path="/payment" element={<Payment />} />

        {/* Protected Routes */}
        <Route element={<UserRoutes />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/update/:id" element={<AdminUpdate />} />
        </Route>

        {/* Additional Pages */}
        <Route path="/admin" element={<Sidebar />} />
        <Route path="/buynow/:id" element={<BuyNow />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/complete" element={<Complete />} />
      </Routes>
    </Router>
  );
}

export default App;
