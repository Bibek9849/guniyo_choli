// src/pages/verify/verifyemail.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState('Processing verification...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    setIsLoading(false);

    if (success === 'true') {
      setMessage('Email verified successfully! Redirecting to login...');
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else if (error) {
      setIsSuccess(false);
      switch (error) {
        case 'no-token':
          setMessage('No verification token provided.');
          break;
        case 'invalid-token':
          setMessage('Invalid or expired verification token.');
          break;
        case 'server-error':
          setMessage('Server error during verification. Please try again.');
          break;
        default:
          setMessage('Email verification failed.');
      }
    } else {
      setMessage('Invalid verification link.');
      setIsSuccess(false);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      padding: "2rem", 
      textAlign: "center", 
      maxWidth: "500px", 
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      {isLoading ? (
        <div>
          <div style={{ 
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #007bff",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <h2 style={{ color: "#333" }}>{message}</h2>
        </div>
      ) : (
        <div>
          <div style={{
            fontSize: "48px",
            marginBottom: "20px"
          }}>
            {isSuccess ? "✅" : "❌"}
          </div>
          <h2 style={{ 
            color: isSuccess ? "#28a745" : "#dc3545",
            marginBottom: "20px"
          }}>
            {message}
          </h2>
          {!isSuccess && (
            <button 
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Go to Login
            </button>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
