import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    refId: '',
    orderId: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPaymentDetails({
      amount: params.get('amt') || 0,
      refId: params.get('refId') || '',
      orderId: params.get('oid') || ''
    });
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Payment Successful!</h2>
          <p className="text-gray-600 mb-8">Thank you for your payment. Your transaction has been completed.</p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-3">
            <p className="text-gray-600">
              Amount Paid: <span className="font-bold text-gray-900">NPR {Number(paymentDetails.amount).toFixed(2)}</span>
            </p>
            <p className="text-gray-600">
              Reference ID: <span className="font-semibold text-gray-900">{paymentDetails.refId}</span>
            </p>
            <p className="text-gray-600">
              Order ID: <span className="font-semibold text-gray-900">{paymentDetails.orderId}</span>
            </p>
          </div>

          {/* Return Button */}
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition duration-200 font-medium text-lg"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 