import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useState } from "react";

const KhaltiWithOrder = ({ amount, products }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const initiateKhaltiPayment = () => {
    const config = {
      publicKey: "test_public_key_11bc2e57406d437ca08a84a1bc30ddd2",
      productIdentity: `Product_${Date.now()}`,
      productName: "Trek Friend Order",
      productUrl: "http://localhost:3000",
      eventHandler: {
        async onSuccess(payload) {
          console.log("Khalti success payload:", payload);

          const token = localStorage.getItem("token");

          const formattedProducts = products.map((item) => ({
            product: item.product?._id || item.productId || item.product,
            quantity: item.quantity,
          }));

          const orderData = {
            ...formData,
            amount,
            products: formattedProducts,
            paymentMethod: "Khalti",
            status: "Paid", // Mark as paid since Khalti succeeded
            khaltiToken: payload.token,
            khaltiIdx: payload.idx,
          };

          try {
            const response = await axios.post(
              "http://localhost:5000/api/orders",
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.data.success) {
              localStorage.removeItem("cart");

              const popup = document.createElement("div");
              popup.className = "success-popup";
              popup.innerHTML = `
                <div class="success-content">
                  <div class="success-icon">✓</div>
                  <h2 style="font-size: 24px; margin: 15px 0;">Payment Successful!</h2>
                  <p style="margin-bottom: 20px;">Your Khalti order was placed.</p>
                  <button id="goToHome" class="home-button">Go to Homepage</button>
                </div>
              `;
              document.body.appendChild(popup);

              document.getElementById("goToHome").addEventListener("click", () => {
                document.body.removeChild(popup);
                window.location.href = "/";
              });
            }
          } catch (error) {
            console.error("Order creation error after Khalti:", error);
            alert("Order creation failed after Khalti payment.");
          }
        },
        onError(error) {
          console.log("Khalti error:", error);
          alert("Khalti payment failed.");
        },
        onClose() {
          console.log("Khalti widget closed");
        },
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: amount * 100 }); // in paisa
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    initiateKhaltiPayment();
  };

  return (
    <>
      <button onClick={() => setShowForm(true)} className="btn-khalti">
        Pay with Khalti
      </button>

      {showForm && (
        <div className="form-overlay">
          <div className="delivery-form">
            <h3>Delivery Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="address"
                  placeholder="Delivery Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Pay & Order
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default KhaltiWithOrder;
