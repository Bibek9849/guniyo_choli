// src/pages/verify/verifyemail.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    const verifyUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/verify-email?token=${token}`);
        setMessage('Email verified successfully!');
        
        // Optional: redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        setMessage('Email verification failed or token is invalid.');
      }
    };

    if (token) {
      verifyUser();
    } else {
      setMessage('No token provided.');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
