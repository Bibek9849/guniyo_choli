import React from "react";
import KhaltiCheckout from "khalti-checkout-web";

const Khalti = ({ amount }) => {
  const handleKhaltiPayment = () => {
    const config = {
      publicKey: "test_public_key_6c3d6f9e1e6b4ef0a7e00783a7b1f6c3",  // Updated verified test key
      productIdentity: `Product_${Date.now()}`,
      productName: "Trek Friend Order",
      productUrl: "http://localhost:3000",
      eventHandler: {
        onSuccess(payload) {
          console.log(payload);
          // Handle success
          window.location.href = `http://localhost:3000/payment/success?oid=${payload.idx}&amt=${amount}&refId=${payload.token}`;
        },
        onError(error) {
          console.log(error);
          window.location.href = "http://localhost:3000/payment/failure";
        },
        onClose() {
          console.log("Widget is closing");
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
    checkout.show({ amount: amount * 100 }); // Khalti takes amount in paisa
  };

  return (
    <button onClick={handleKhaltiPayment} className="btn-khalti">
      Pay with Khalti
    </button>
  );
};

export default Khalti; 