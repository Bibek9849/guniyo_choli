import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h2>
      <p className="mb-6">Sorry, your payment could not be processed.</p>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={() => navigate('/payment')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Try Again
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure; 