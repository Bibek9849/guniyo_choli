import React from "react";

const Esewa = ({ amount }) => {
  const handleEsewaPayment = () => {
    const pid = `TEST_${Date.now()}`;
    const totalAmount = Number(amount);
    
    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert("Invalid amount");
      return;
    }

    // Construct the eSewa payment URL with query parameters
    const path = "https://rc-epay.esewa.com.np/epay/main";
    const params = new URLSearchParams({
      amt: totalAmount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: totalAmount,
      pid: pid,
      scd: "EPAYTEST",
      su: "http://localhost:3000/payment/success",
      fu: "http://localhost:3000/payment/failure"
    }).toString();

    // Redirect to eSewa payment page
    window.location.href = `${path}?${params}`;
  };

  return (
    <button 
      onClick={handleEsewaPayment}
      className="btn-esewa"
    >
      Pay with eSewa
    </button>
  );
};

export default Esewa;
