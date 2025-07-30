// src/components/Cart.js
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/Cart.css";
import KhaltiWithOrder from "../payment/Khalti"; // at the top

// eSewa Payment Button
const Esewa = ({ amount }) => {
  const handleEsewaPayment = () => {
    const pid = `TEST_${Date.now()}`;
    const totalAmount = Number(amount);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert("Invalid amount");
      return;
    }

    const path = "https://rc-epay.esewa.com.np/epay/main";
    const params = new URLSearchParams({
      amt: totalAmount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: totalAmount,
      pid: pid,
      scd: "EPAYTEST",
      su: "https://localhost:3000/payment/success",
      fu: "https://localhost:3000/payment/failure",
    }).toString();

    window.location.href = `${path}?${params}`;
  };

  return (
    <button onClick={handleEsewaPayment} className="btn-esewa">
      Pay with eSewa
    </button>
  );
};

// Khalti Payment Button
const Khalti = ({ amount }) => {
  const handleKhaltiPayment = () => {
    const config = {
      // publicKey: "test_public_key_6c3d6f9e1e6b4ef0a7e00783a7b1f6c3",
      publicKey: "test_public_key_11bc2e57406d437ca08a84a1bc30ddd2",

      productIdentity: `Product_${Date.now()}`,
      productName: "Trek Friend Order",
      productUrl: "https://localhost:3000",
      eventHandler: {
        onSuccess(payload) {
          console.log("Khalti success:", payload);
          window.location.href = `https://localhost:3000/payment/success?oid=${payload.idx}&amt=${amount}&refId=${payload.token}`;
        },
        onError(error) {
          console.log("Khalti error:", error);
          window.location.href = "https://localhost:3000/payment/failure";
        },
        onClose() {
          console.log("Khalti widget closed");
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: amount * 100 }); // Amount in paisa
  };

  return (
    <button onClick={handleKhaltiPayment} className="btn-khalti">
      Pay with Khalti
    </button>
  );
};

const stripePromise = loadStripe(
  "pk_test_51Rp2bKLhHv3emNgTyRwTWMco6Kdl64c3ATYIzViO2EwlzquFWLs82PaFqA64RDo16mNekE9GW1n8C8K5B0WlJW6700gie3G35r"
);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  }, []);

  const calculateTotal = (cart) => {
    const totalAmount = cart.reduce(
      (sum, item) => sum + parseFloat(item.productPrice) * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handleIncreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleRemoveAll = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    setTotal(0);
  };

  const handleProceedToPayment = () => {
    navigate("/payment", { state: { cartItems, total } });
  };

  const makePayment = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    try {
      const stripe = await stripePromise;

      const response = await axios.post("https://localhost:5000/api/payment/stripe", {
        products: cartItems,
        amount: total,
      });

      const sessionId = response.data.sessionId;

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      alert("Stripe payment failed. Try again.");
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Cart</h1>
        {cartItems.length > 0 && (
          <button className="clear-cart-btn" onClick={handleRemoveAll}>
            Remove All
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`https://localhost:5000/products/${item.productImage}`}
                      alt={item.productName}
                      className="cart-item-image"
                    />
                  </td>
                  <td>{item.productName}</td>
                  <td>Rs. {parseFloat(item.productPrice).toFixed(2)}</td>
                  <td>
                    <div className="quantity-control">
                      <button
                        className="decrease-btn"
                        onClick={() => handleDecreaseQuantity(index)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="increase-btn"
                        onClick={() => handleIncreaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>Rs. {(parseFloat(item.productPrice) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="total-amount">Total: Rs. {total.toFixed(2)}</h2>

          <div className="payment-buttons">
            <button className="proceed-btn" onClick={handleProceedToPayment}>
              Cash On Delivery
            </button>

            <button className="stripe-btn" onClick={makePayment}>
              Pay with Card (Stripe)
            </button>

            <Esewa amount={total} />
            <KhaltiWithOrder amount={total} products={cartItems} />
            </div>
        </>
      )}
    </div>
  );
};

export default Cart;
